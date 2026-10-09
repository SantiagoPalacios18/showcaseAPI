const { Router } = require('express');
const {
    getAdministradores,
    getAdministradorById,
    createAdministrador,
    modifyAdministradorById,
    deleteAdministradorById,
    adminHomeMessage,
} = require('../controllers/administradorBD__Controller');

const { authMiddleware, checkPatent } = require('../middlewares/auth__Middleware');

const router = Router();

router.get('/', authMiddleware, checkPatent("ADMIN_HOME"), adminHomeMessage);
router.get('/getall', getAdministradores);
router.get('/getById/:id', getAdministradorById);
router.post('/create', createAdministrador);
router.patch('/modify/:id', modifyAdministradorById);
router.delete('/delete:id', deleteAdministradorById);

module.exports = router;    