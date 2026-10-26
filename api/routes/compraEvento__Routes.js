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
const { authMiddleware } = require('../middlewares/auth__Middleware.js');

// GET: Obtener todas las compras/reservas (solo requiere estar logueado)
router.get('/', authMiddleware, getComprasEventos);

// GET: Obtener compra/reserva por ID
router.get('/getByPk/:id', authMiddleware, getCompraEventoById);

// POST: Crear nueva reserva
router.post('/', authMiddleware, createCompraEvento);

// PATCH: Modificar reserva existente
router.patch('/:id', authMiddleware, modifyCompraEventoById);

// DELETE: Eliminar / cancelar reserva
router.delete('/:id', authMiddleware, deleteCompraEventoById);

module.exports = router;