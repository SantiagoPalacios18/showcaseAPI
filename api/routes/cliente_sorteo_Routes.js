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

router.get('/', getClientesSorteos);
router.get('/getByPk/:id_sorteo/:id_Usuario', getClienteSorteoByPk);
router.get('/getByPk/:id_sorteo', getClientesBySorteoId);
router.get('/getById_u/:id_sorteo/:id_Usuario', getUnClienteSorteo);
router.post('/', createClienteSorteo);
router.patch('/edit/:id_sorteo/:id_Usuario', modifyClienteSorteo);
router.delete('/:id_sorteo/:id_Usuario', deleteClienteSorteo);

module.exports = router;