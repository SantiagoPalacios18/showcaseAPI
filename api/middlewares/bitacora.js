const { Bitacora } = require('../models/bitacora__Model.js');


// Función que arregla los valores de Ids ya que llegan como string
function idEntero(valor) {
    if (valor === null || valor === undefined || valor === '') return null;
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 0) return null;
    return numero;
}

function idRegistroDe(path) {
    const numeros = String(path)
        .split('/')  // /actor/edit/3ads
        .filter((parte) => /^\d+$/.test(parte)); // Solamente los que cumplan la condicion de ser un digito
        // El .test testea el regex, el .filter toma esos trues o falses que devuelve el .test y guarda solo los q cumplieron
        if (numeros.length !== 1) return null;
    return idEntero(numeros[0]);
}

// Clasifica la acción, tabla e id_registro (registro modificado) para meterlo en la bitácora
function clasificar(req, res, pathOriginal) {
    const metodo = req.method;
    // Solo guardamos modificaciones de datos, no gets
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(metodo)) return null;

    const path = String(pathOriginal || req.originalUrl || '').split('?')[0].replace(/\/+$/, '') || '/';

    if (metodo === 'POST' && path === '/login') {
        return { accion: 'LOGIN', tabla: 'Usuario', id_Registro: idEntero(res.locals.id_Registro) }; // Se usa lo de res.locals pq en estas urls no podemos sacar el id del usuario, entonces el controller nos lo pasa por este lugar, de esta forma podemos guardar el id del usuario igualmente en la bitácora
    }
    if (metodo === 'POST' && path === '/logout') {
        return { accion: 'LOGOUT', tabla: 'Usuario', id_Registro: idEntero(res.locals.id_Registro) };
    }
    if (metodo === 'POST' && path === '/refresh') {
        return { accion: 'REFRESH', tabla: 'Sesion', id_Registro: idEntero(res.locals.id_Registro) };
    }
    if (path === '/codes/solicitar') {
        return { accion: 'RECUPERAR_SOLICITAR', tabla: 'Code', id_Registro: idEntero(res.locals.id_Registro) };
    }
    if (path === '/codes/verificar') {
        return { accion: 'RECUPERAR_VERIFICAR', tabla: 'Code', id_Registro: idEntero(res.locals.id_Registro) };
    }
    if (path === '/codes/restablecer') {
        return { accion: 'RECUPERAR_RESTABLECER', tabla: 'Code', id_Registro: idEntero(res.locals.id_Registro) };
    }

    const partes = path.split('/').filter(Boolean);
    if (partes.length === 0) return null;

    let accion = 'ALTA';
    if (metodo === 'PATCH' || metodo === 'PUT') accion = 'MODIFICACION';
    if (metodo === 'DELETE') accion = 'BAJA';

    return {
        accion,
        tabla: partes[0].slice(0, 50),
        id_Registro: idRegistroDe(path)
    };
}

async function registrar({ accion, tabla, id_Usuario = null, id_Registro = null }) {
    try {
        await Bitacora.create({
            accion: String(accion).slice(0, 50),
            tabla: String(tabla).slice(0, 50),
            id_Usuario: idEntero(id_Usuario),
            id_Registro: idEntero(id_Registro)
        });
    } catch (error) {
        console.error('No se pudo escribir la bitácora:', error.message);
    }
}

function bitacoraHttp(req, res, next) {
    const pathOriginal = req.originalUrl;
    res.on('finish', () => { // Cuando llegue el aviso de que terminó, se ejecuta esta funcion
        try {
            if (res.statusCode >= 400) return; // Solo registra operaciones que salieron bien
            const info = clasificar(req, res, pathOriginal);
            if (!info) return;
            registrar({
                ...info,
                id_Usuario: req.user?.id_Usuario ?? res.locals.id_Usuario
            });
        } catch (error) {
            console.error('No se pudo preparar la bitácora:', error.message);
        }
    });
    next();
}

module.exports = { registrar, bitacoraHttp };
