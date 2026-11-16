const crypto = require('crypto');
const { sequelize } = require('../config/db.js');
const { DVV } = require('../models/DVV__Model.js');

// La columna DVH del proyecto es STRING(6) y valida isAlphanumeric.
// Se guarda el prefijo de 6 caracteres del sha256. El DVV sí guarda el sha256 completo.
const TIPOS_NUMERICOS = new Set([
    'INTEGER', 'BIGINT', 'FLOAT', 'REAL', 'DOUBLE', 'DECIMAL',
    'TINYINT', 'SMALLINT', 'MEDIUMINT'
]);

function hashTexto(texto) {
    return crypto.createHash('sha256').update(String(texto), 'utf8').digest('hex');
}

function dvhCorto(texto) { // Pq pusimos el dvg de 6 dig
    return hashTexto(texto).slice(0, 6);
}

function claveTipo(attr) {
    const type = attr && attr.type;
    if (!type) return '';
    return type.key || (type.constructor && type.constructor.key) || '';
}

function ordenarJson(valor) {
    if (Array.isArray(valor)) return valor.map(ordenarJson);
    if (valor && typeof valor === 'object' && !(valor instanceof Date) && !Buffer.isBuffer(valor)) {
        const salida = {};
        for (const clave of Object.keys(valor).sort()) {
            salida[clave] = ordenarJson(valor[clave]);
        }
        return salida;
    }
    return valor;
}

function serializar(valor, attr) {
    if (valor === null || valor === undefined) return '';

    const clave = claveTipo(attr);

    if (clave === 'BOOLEAN') {
        return valor === true || valor === 1 || valor === '1' ? '1' : '0';
    }

    if (clave === 'DATEONLY') {
        if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
            const anio = valor.getFullYear();
            const mes = String(valor.getMonth() + 1).padStart(2, '0');
            const dia = String(valor.getDate()).padStart(2, '0');
            return `${anio}-${mes}-${dia}`;
        }
        return String(valor).slice(0, 10);
    }

    if (clave === 'DATE') {
        const fecha = valor instanceof Date ? valor : new Date(valor);
        if (Number.isNaN(fecha.getTime())) return String(valor);
        return fecha.toISOString();
    }

    if (clave === 'TIME') {
        if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
            return valor.toISOString().slice(11, 19);
        }
        const texto = String(valor);
        const coincidencia = texto.match(/(\d{2}:\d{2}:\d{2})/);
        return coincidencia ? coincidencia[1] : texto;
    }

    if (TIPOS_NUMERICOS.has(clave)) {
        const numero = Number(valor);
        return Number.isFinite(numero) ? String(numero) : String(valor);
    }

    if (clave === 'JSON') {
        let dato = valor;
        if (typeof dato === 'string') {
            try {
                dato = JSON.parse(dato);
            } catch {
                return dato;
            }
        }
        return JSON.stringify(ordenarJson(dato));
    }

    if (Buffer.isBuffer(valor)) return valor.toString('base64');

    if (typeof valor === 'object') {
        try {
            return JSON.stringify(ordenarJson(valor));
        } catch {
            return String(valor);
        }
    }

    return String(valor);
}

function atributosHash(modelo) {
    return Object.values(modelo.rawAttributes)
        .filter((attr) => attr.fieldName !== 'DVH' && claveTipo(attr) !== 'VIRTUAL')
        .sort((a, b) => a.fieldName.localeCompare(b.fieldName));
}

function calcularDVH(modelo, plain) {
    const texto = atributosHash(modelo)
        .map((attr) => serializar(plain[attr.fieldName], attr))
        .join('|');
    return dvhCorto(texto);
}

function modelosConDVH() {
    return Object.values(sequelize.models).filter((modelo) => modelo.rawAttributes && modelo.rawAttributes.DVH);
}

function clavesPrimarias(modelo) {
    return Object.values(modelo.rawAttributes)
        .filter((attr) => attr.primaryKey)
        .map((attr) => attr.fieldName);
}

function aplicarDVH(modelo, instancia) {
    if (!instancia || typeof instancia.get !== 'function') return;
    const plain = instancia.get({ plain: true });
    instancia.setDataValue('DVH', calcularDVH(modelo, plain));
}

async function recalcularTabla(modelo, options = {}) {
    const transaction = options.transaction;
    const claves = clavesPrimarias(modelo);
    const filas = await modelo.findAll({
        order: claves.map((clave) => [clave, 'ASC']),
        transaction
    });

    const dvhs = [];
    for (const fila of filas) {
        const dvh = calcularDVH(modelo, fila.get({ plain: true }));
        dvhs.push(dvh);
        if (fila.getDataValue('DVH') !== dvh) {
            const where = {};
            for (const clave of claves) where[clave] = fila.get(clave);
            await modelo.update(
                { DVH: dvh },
                {
                    where,
                    hooks: false,
                    validate: false,
                    individualHooks: false,
                    transaction
                }
            );
            fila.setDataValue('DVH', dvh);
        }
    }

    const dvv = hashTexto(dvhs.join('|'));
    await DVV.upsert({ tabla: modelo.name, dvv }, { transaction });
    return dvv;
}

async function recalcularTodo() {
    for (const modelo of modelosConDVH()) {
        await recalcularTabla(modelo);
    }
}

async function verificarIntegridad(idUsuario) {
    const { registrar } = require('../middlewares/bitacora.js');
    const errores = [];

    for (const modelo of modelosConDVH()) {
        const claves = clavesPrimarias(modelo); // para identificarla en el caso de que este mal su DVH
        const filas = await modelo.findAll({
            order: claves.map((clave) => [clave, 'ASC'])
        });
        const dvhs = [];
        // CALCULO DE DVH DE CADA FILA
        for (const fila of filas) {
            const dvh = calcularDVH(modelo, fila.get({ plain: true })); // plain: true para tener el objeto plano sin nada extra
            dvhs.push(dvh);
            if (fila.getDataValue('DVH') !== dvh) {
                const id = {};
                for (const clave of claves) id[clave] = fila.get(clave);
                errores.push({ tabla: modelo.name, tipo: 'DVH', id });
            }
        }
        // CALCULO DE DVV DE LA TABLA
        const esperado = hashTexto(dvhs.join('|'));
        const guardado = await DVV.findByPk(modelo.name);
        if (!guardado || guardado.dvv !== esperado) {
            errores.push({ tabla: modelo.name, tipo: 'DVV' });
        }
    }

    await registrar({
        accion: 'VERIFICACION_INTEGRIDAD',
        tabla: 'DVV',
        id_Usuario: idUsuario,
        id_Registro: null
        // No le pasamos si salió bien o no pq no incluimos el campo "descripción", tal vez estaría bueno meterlo
    });

    return errores;
}

async function recargar(instancia, opciones) {
    if (!instancia || typeof instancia.reload !== 'function') return;
    await instancia.reload({ transaction: opciones && opciones.transaction });
}

let enganchado = false;

function engancharIntegridad() {
    if (enganchado) return;
    enganchado = true;

    for (const modelo of modelosConDVH()) {
        modelo.addHook('beforeValidate', (instancia) => {
            aplicarDVH(modelo, instancia);
        });

        modelo.addHook('beforeBulkCreate', (instancias) => {
            if (!Array.isArray(instancias)) return;
            for (const instancia of instancias) aplicarDVH(modelo, instancia);
        });

        modelo.addHook('afterCreate', async (instancia, opciones) => {
            await recalcularTabla(modelo, opciones || {});
            await recargar(instancia, opciones);
        });

        modelo.addHook('afterBulkCreate', async (instancias, opciones) => {
            await recalcularTabla(modelo, opciones || {});
            if (Array.isArray(instancias)) {
                for (const instancia of instancias) await recargar(instancia, opciones);
            }
        });

        modelo.addHook('afterUpdate', async (instancia, opciones) => {
            await recalcularTabla(modelo, opciones || {});
            await recargar(instancia, opciones);
        });

        modelo.addHook('afterBulkUpdate', async (opciones) => {
            await recalcularTabla(modelo, opciones || {});
        });

        modelo.addHook('afterDestroy', async (instancia, opciones) => {
            await recalcularTabla(modelo, opciones || {});
        });

        modelo.addHook('afterBulkDestroy', async (opciones) => {
            await recalcularTabla(modelo, opciones || {});
        });
    }
}

module.exports = {
    hashTexto,
    dvhCorto,
    calcularDVH,
    modelosConDVH,
    recalcularTabla,
    recalcularTodo,
    verificarIntegridad,
    engancharIntegridad
};
