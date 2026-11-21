const { Router } = require('express');
const { checkPatent } = require('../middlewares/auth__Middleware.js');
const {
    verificarIntegridad,
    listarBackups,
    crearBackup,
    restaurarBackup,
    rectificar
} = require('../services/integridad__Service.js');

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

router.get('/backups', checkPatent('ADMIN_HOME'), async (req, res) => {
    try {
        const archivos = await listarBackups();
        res.status(200).json({ archivos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/backup', checkPatent('ADMIN_HOME'), async (req, res) => {
    try {
        const resultado = await crearBackup(req.user?.id_Usuario ?? null);
        res.status(200).json({ message: 'Backup creado', ...resultado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/restore', checkPatent('ADMIN_HOME'), async (req, res) => {
    try {
        const archivo = typeof req.body?.archivo === 'string' ? req.body.archivo : '';
        const resultado = await restaurarBackup(archivo, req.user?.id_Usuario ?? null);
        res.status(200).json({ message: 'Backup restaurado', ...resultado });
    } catch (error) {
        const status = error.message === 'El backup pedido no es un archivo válido' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
});

router.post('/rectificar', checkPatent('ADMIN_HOME'), async (req, res) => {
    try {
        await rectificar(req.user?.id_Usuario ?? null);
        res.status(200).json({ message: 'Rectificación realizada.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
