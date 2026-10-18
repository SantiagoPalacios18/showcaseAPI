const express = require('express');
const router = express.Router();
const {
    getClientesSorteos,
    getClientesBySorteoId,
    createClienteSorteo,
    modifyClienteSorteo,
    deleteClienteSorteo
} = require('../controllers/cliente_sorteo_Controller.js');

router.get('/', getClientesSorteos);
router.get('/:id_sorteo', getClientesBySorteoId);
router.post('/', createClienteSorteo);
router.patch('/:id_Cliente/:id_sorteo', modifyClienteSorteo);
router.delete('/:id_Cliente/:id_sorteo', deleteClienteSorteo);

module.exports = router;