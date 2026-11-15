const express = require('express');
const router = express.Router();
const {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
} = require('../controllers/compraEvento_controller.js');

// Importamos únicamente el middleware de autenticación
const { authMiddleware, checkPatent } = require('../middlewares/auth__Middleware.js');

// GET: Obtener todas las compras/reservas (solo requiere estar logueado)
router.get('/', authMiddleware, checkPatent("GET_REGISTERS"), getComprasEventos);

// GET: Obtener compra/reserva por ID
router.get('/getByPk/:id', authMiddleware, checkPatent("GET_REGISTER_BY_ID"), getCompraEventoById);

// POST: Crear nueva reserva
router.post('/', authMiddleware, checkPatent("POST_REGISTER"), createCompraEvento);

// PATCH: Modificar reserva existente
router.patch('/edit/:id', authMiddleware, checkPatent("PATCH_REGISTER"), modifyCompraEventoById);

// DELETE: Eliminar / cancelar reserva
router.delete('/:id', authMiddleware, checkPatent("DELETE_REGISTER"), deleteCompraEventoById);

module.exports = router;