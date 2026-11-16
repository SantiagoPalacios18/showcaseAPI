const express = require('express');
const router = express.Router();
const {
    getClientesSorteos,
    getClientesBySorteoId,
    getClienteSorteoByPk,
    getUnClienteSorteo,
    createClienteSorteo,
    modifyClienteSorteo,
    deleteClienteSorteo
} = require('../controllers/cliente_sorteo_Controller.js');
const {authMiddleware, checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', authMiddleware, checkPatent("GET_REGISTERS"), getClientesSorteos);
router.get('/getByPk/:id_sorteo/:id_Usuario', authMiddleware, checkPatent("GET_REGISTER_BY_ID"), getClienteSorteoByPk);
router.get('/getByPk/:id_sorteo', authMiddleware, checkPatent("GET_REGISTERS"), getClientesBySorteoId);
router.get('/getById_u/:id_sorteo/:id_Usuario', authMiddleware, checkPatent("GET_REGISTER_BY_ID"), getUnClienteSorteo);
router.post('/', authMiddleware, checkPatent("POST_REGISTER"), createClienteSorteo);
router.patch('/edit/:id_sorteo/:id_Usuario', authMiddleware, checkPatent("PATCH_REGISTER"), modifyClienteSorteo);
router.delete('/:id_sorteo/:id_Usuario', authMiddleware, checkPatent("DELETE_REGISTER"), deleteClienteSorteo);

module.exports = router;