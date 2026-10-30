const { Router } = require('express');
const { crearPreferenciaCompraEvento } = require('../controllers/pago_Controller');
const { authMiddleware } = require('../middlewares/auth__Middleware.js');

const router = Router();

// Endpoint específico para compras de eventos
router.post('/crear-preferencia-evento', authMiddleware, crearPreferenciaCompraEvento);

// router.post('/crear-preferencia-otra-cosa', authMiddleware, crearPreferenciaOtraCosa);

module.exports = router;