const express = require('express');
const router = express.Router();
const {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
} = require('../controllers/compraEvento_controller.js');

router.get('/', getComprasEventos);
router.get('/:id', getCompraEventoById);
router.post('/', createCompraEvento);
router.patch('/:id', modifyCompraEventoById);
router.delete('/:id', deleteCompraEventoById);

module.exports = router;