const { sequelize } = require('../config/db.js');
const { recalcularTodo } = require('../services/integridad__Service.js');
const { registrar } = require('../middlewares/bitacora.js');

const LIMITE_FILAS = 100;
const LECTURA = new Set(['SELECT', 'SHOW', 'DESCRIBE', 'DESC', 'EXPLAIN', 'WITH']);

function palabraInicial(sql) {
    const sinComentarios = sql
        .replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/--[^\n]*/g, ' ')
        .replace(/#[^\n]*/g, ' ')
        .trim();
    const coincidencia = sinComentarios.match(/^([A-Za-z]+)/);
    return coincidencia ? coincidencia[1].toUpperCase() : '';
}

// Cuenta los ; que están fuera de textos. MySQL acepta el del final, no dos consultas juntas.
function puntosYComa(sql) {
    let enTexto = false;
    let comilla = '';
    let cantidad = 0;
    for (let i = 0; i < sql.length; i++) {
        const c = sql[i];
        if (enTexto) {
            if (c === '\\') {
                i++;
                continue;
            }
            if (c === comilla) {
                if (sql[i + 1] === comilla) {
                    i++;
                    continue;
                }
                enTexto = false;
            }
            continue;
        }
        if (c === "'" || c === '"' || c === '`') {
            enTexto = true;
            comilla = c;
            continue;
        }
        if (c === ';') cantidad++;
    }
    return cantidad;
}

const ejecutarSQL = async (req, res) => {
    const consulta = typeof req.body?.consulta === 'string' ? req.body.consulta.trim() : '';
    if (!consulta) {
        return res.status(400).json({ message: 'No hay consulta para ejecutar' });
    }
    if (consulta.length > 20000) {
        return res.status(400).json({ message: 'La consulta supera el límite de 20000 caracteres' });
    }
    if (puntosYComa(consulta) > 1) {
        return res.status(400).json({ message: 'Una consulta por vez. El punto y coma del final está bien.' });
    }

    const lectura = LECTURA.has(palabraInicial(consulta));

    try {
        const [resultado] = await sequelize.query(consulta);

        if (Array.isArray(resultado)) {
            const total = resultado.length;
            const filas = resultado.slice(0, LIMITE_FILAS);
            const columnas = filas.length > 0 ? Object.keys(filas[0]) : [];
            return res.status(200).json({
                tipo: 'filas',
                columnas,
                filas,
                total,
                mostradas: filas.length
            });
        }

        // El SQL crudo no pasa por los hooks, así que el DVH quedaría viejo.
        let aviso = null;
        if (!lectura) {
            try {
                await recalcularTodo();
            } catch (error) {
                aviso = 'La consulta se ejecutó, pero no se pudo recalcular el DVH: ' + error.message;
            }
            await registrar({
                accion: 'MODIFICACION',
                tabla: 'SQL',
                id_Usuario: req.user?.id_Usuario ?? null,
                id_Registro: null
            });
        }

        const info = resultado?.info;
        const afectadas = resultado?.affectedRows;
        const insertId = resultado?.insertId;
        let mensaje = 'OK';
        if (info) {
            mensaje = insertId ? `${info} (id ${insertId})` : info;
        } else if (typeof afectadas === 'number') {
            mensaje = `OK, ${afectadas} fila(s) afectada(s).`;
        }

        return res.status(200).json({ tipo: 'ok', mensaje, aviso });
    } catch (error) {
        const message = error?.original?.sqlMessage || error.message;
        return res.status(400).json({ message });
    }
};

module.exports = { ejecutarSQL };
