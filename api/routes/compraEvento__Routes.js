const express = require('express');
const router = express.Router();
const {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
} = require('../controllers/compraEvento_controller.js');

// Importamos los middlewares de autenticación y verificación de patentes (permisos)
const { authMiddleware, checkPatent } = require('../middlewares/auth__Middleware.js');

// GET: Obtener todas las compras/reservas (ej. requiere estar logueado y permiso de lectura)
router.get('/', authMiddleware, checkPatent('VER_RESERVA_EVENTO'), getComprasEventos);

// GET: Obtener compra/reserva por ID
router.get('/getByPk/:id', authMiddleware, checkPatent('VER_RESERVA_EVENTO'), getCompraEventoById);

// POST: Crear nueva reserva (Salida Grupal, Corporativo, Cumpleaños)
// Cumple con la precondición del CU: "El usuario debe tener permisos para realizar la acción"
router.post('/', authMiddleware, checkPatent('CREAR_RESERVA_EVENTO'), createCompraEvento);

// PATCH: Modificar reserva existente
router.patch('/:id', authMiddleware, checkPatent('MODIFICAR_RESERVA_EVENTO'), modifyCompraEventoById);

// DELETE: Eliminar / cancelar reserva
router.delete('/:id', authMiddleware, checkPatent('ELIMINAR_RESERVA_EVENTO'), deleteCompraEventoById);

module.exports = router;