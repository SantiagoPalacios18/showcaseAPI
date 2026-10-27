const express = require('express');
const router = express.Router();
const {
    solicitarCodigo,
    verificarCodigo,
    restablecerContraseña
} = require('../controllers/code__controller');

// Rutas públicas (el usuario que olvidó su contraseña no tiene token)
router.post('/solicitar', solicitarCodigo);
router.post('/verificar', verificarCodigo);
router.patch('/restablecer', restablecerContraseña);
    
module.exports = router;