const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { sequelize } = require('../config/db.js');
const { DVV } = require('../models/DVV__Model.js');

const CARPETA_BACKUPS = path.join(__dirname, '..', 'backups');
const NOMBRE_BACKUP = /^backup-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}(?:-\d+)?\.json$/;

// La columna DVH del proyecto es STRING(6) y valida isAlphanumeric.
// Se guarda el prefijo de 6 caracteres del sha256. El DVV sí guarda el sha256 completo.
const TIPOS_NUMERICOS = new Set([
    'INTEGER', 'BIGINT', 'FLOAT', 'REAL', 'DOUBLE', 'DECIMAL',
    'TINYINT', 'SMALLINT', 'MEDIUMINT'
]);
// hasheao en uft8
function hashTexto(texto) {
    return crypto.createHash('sha256').update(String(texto), 'utf8').digest('hex');
}

function dvhCorto(texto) { // Pq pusimos el dvg de 6 dig
    return hashTexto(texto).slice(0, 6);
}
// identificar el tipo de dato del atributo
function claveTipo(attr) {
    const type = attr && attr.type;
    if (!type) return '';
    return type.key || (type.constructor && type.constructor.key) || '';
}

/*function ordenarJson(valor) {
    if (Array.isArray(valor)) return valor.map(ordenarJson);
    if (valor && typeof valor === 'object' && !(valor instanceof Date) && !Buffer.isBuffer(valor)) {
        const salida = {};
        for (const clave of Object.keys(valor).sort()) {
            salida[clave] = ordenarJson(valor[clave]);
        }
        return salida;
    }
    return valor;
}*/

function serializar(valor, attr) {
    const clave = claveTipo(attr);

    // Estandarizar para que todos digan lo mismo sin importar qué
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

    /*if (clave === 'JSON') {
        let dato = valor;
        if (typeof dato === 'string') {
            try {
                dato = JSON.parse(dato);
            } catch {
                return dato;
            }
        }
        return JSON.stringify(ordenarJson(dato));
    }*/
    // para guardar los archivos blob
    if (Buffer.isBuffer(valor)) return valor.toString('base64');

    /*if (typeof valor === 'object') {
        try {
            return JSON.stringify(ordenarJson(valor));
        } catch {
            return String(valor);
        }
    }*/
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

function modelosBackup() {
    return Object.values(sequelize.models).sort((a, b) => a.name.localeCompare(b.name));
}

function nombreTabla(modelo) {
    const nombre = modelo.getTableName();
    return typeof nombre === 'object' ? nombre.tableName : nombre;
}

function valorParaArchivo(attr, valor) {
    if (valor === null || valor === undefined) return valor;
    if (Buffer.isBuffer(valor)) return { __base64: valor.toString('base64') };
    if (!(valor instanceof Date) || Number.isNaN(valor.getTime())) return valor;

    const clave = claveTipo(attr);
    if (clave === 'DATEONLY') {
        const mes = String(valor.getMonth() + 1).padStart(2, '0');
        const dia = String(valor.getDate()).padStart(2, '0');
        return `${valor.getFullYear()}-${mes}-${dia}`;
    }
    if (clave === 'TIME') return valor.toISOString().slice(11, 19);
    return valor.toISOString();
}

function filaParaArchivo(modelo, plain) {
    const salida = {};
    for (const attr of Object.values(modelo.rawAttributes)) {
        if (claveTipo(attr) === 'VIRTUAL') continue;
        salida[attr.fieldName] = valorParaArchivo(attr, plain[attr.fieldName]);
    }
    return salida;
}

function filaParaCargar(modelo, fila) {
    const salida = {};
    for (const [clave, valor] of Object.entries(fila)) {
        if (valor && typeof valor === 'object' && typeof valor.__base64 === 'string') {
            salida[clave] = Buffer.from(valor.__base64, 'base64');
            continue;
        }
        // Sequelize vuelve a serializar las columnas JSON. Si el archivo ya trae el texto, hay que parsearlo para no guardarlo dos veces.
        const attr = modelo.rawAttributes[clave];
        if (attr && claveTipo(attr) === 'JSON' && typeof valor === 'string') {
            try {
                salida[clave] = JSON.parse(valor);
            } catch {
                salida[clave] = valor;
            }
            continue;
        }
        salida[clave] = valor;
    }
    return salida;
}

function nombreDeBackup(fecha = new Date()) {
    const parte = (numero) => String(numero).padStart(2, '0');
    return `backup-${fecha.getFullYear()}-${parte(fecha.getMonth() + 1)}-${parte(fecha.getDate())}T${parte(fecha.getHours())}-${parte(fecha.getMinutes())}-${parte(fecha.getSeconds())}-${fecha.getMilliseconds()}.json`;
}

function archivoBackup(nombre) {
    if (!NOMBRE_BACKUP.test(nombre)) {
        throw new Error('El backup pedido no es un archivo válido');
    }
    return path.join(CARPETA_BACKUPS, nombre);
}

async function listarBackups() {
    await fs.mkdir(CARPETA_BACKUPS, { recursive: true });
    const nombres = await fs.readdir(CARPETA_BACKUPS);
    return nombres.filter((nombre) => NOMBRE_BACKUP.test(nombre)).sort().reverse();
}

async function crearBackup(idUsuario) {
    const { registrar } = require('../middlewares/bitacora.js');
    const tablas = {};
    for (const modelo of modelosBackup()) {
        const filas = await modelo.findAll();
        tablas[modelo.name] = filas.map((fila) => filaParaArchivo(modelo, fila.get({ plain: true })));
    }

    await fs.mkdir(CARPETA_BACKUPS, { recursive: true });
    const archivo = nombreDeBackup();
    await fs.writeFile(
        path.join(CARPETA_BACKUPS, archivo),
        JSON.stringify({ creado: new Date().toISOString(), tablas }, null, 2),
        'utf8'
    );
    await registrar({
        accion: 'BACKUP',
        tabla: 'DVV',
        id_Usuario: idUsuario,
        id_Registro: null
    });
    return { archivo, tablas: Object.keys(tablas).length };
}

async function restaurarBackup(nombre, idUsuario) {
    const { registrar } = require('../middlewares/bitacora.js');
    const contenido = await fs.readFile(archivoBackup(nombre), 'utf8');
    const data = JSON.parse(contenido);
    if (!data || typeof data.tablas !== 'object' || Array.isArray(data.tablas)) {
        throw new Error('El backup no tiene el formato esperado');
    }

    const modelos = modelosBackup();
    await sequelize.transaction(async (transaction) => {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { transaction });
        for (const modelo of modelos) {
            const tabla = nombreTabla(modelo).replace(/`/g, '``');
            await sequelize.query(`DELETE FROM \`${tabla}\``, { transaction });
        }
        for (const modelo of modelos) {
            const filas = Array.isArray(data.tablas[modelo.name]) ? data.tablas[modelo.name] : [];
            for (let i = 0; i < filas.length; i += 200) {
                await modelo.bulkCreate(filas.slice(i, i + 200).map((fila) => filaParaCargar(modelo, fila)), {
                    hooks: false,
                    validate: false,
                    individualHooks: false,
                    transaction
                });
            }
        }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { transaction });
    });

    await registrar({
        accion: 'RESTORE',
        tabla: 'DVV',
        id_Usuario: idUsuario,
        id_Registro: null
    });
    return { archivo: nombre };
}

async function rectificar(idUsuario) {
    const { registrar } = require('../middlewares/bitacora.js');
    await recalcularTodo();
    await registrar({
        accion: 'RECTIFICACION',
        tabla: 'DVV',
        id_Usuario: idUsuario,
        id_Registro: null
    });
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
    engancharIntegridad,
    listarBackups,
    crearBackup,
    restaurarBackup,
    rectificar
};
