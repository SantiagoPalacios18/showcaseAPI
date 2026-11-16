const { Router } = require('express');
const { checkPatent } = require('../middlewares/auth__Middleware.js');
const { verificarIntegridad } = require('../services/integridad__Service.js');

const router = Router();

// COMPLETAMENTE innecesario hacer un controller de esto, lo puse directamente acá
router.get('/verificar', checkPatent('ADMIN_HOME'), async (req, res) => {
    try {
        const errores = await verificarIntegridad(req.user?.id_Usuario ?? null);
        res.status(200).json({
            integra: errores.length === 0,
            errores
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
