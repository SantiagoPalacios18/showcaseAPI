const express = require('express');
const router = express.Router();
const {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
} = require('../controllers/compraEvento_controller.js');

const { checkPatent } = require('../middlewares/auth__Middleware.js');

router.get('/', checkPatent("GET_REGISTERS"), getComprasEventos);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getCompraEventoById);
router.post('/', checkPatent("POST_REGISTER"), createCompraEvento);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyCompraEventoById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteCompraEventoById);

module.exports = router;