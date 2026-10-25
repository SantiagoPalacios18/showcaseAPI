const express = require('express');
const router = express.Router();
const {
    getUsuariosSorteos,
    getUsuariosBySorteoId,
    createUsuarioSorteo,
    modifyUsuarioSorteo,
    deleteUsuarioSorteo
} = require('../controllers/usuario_sorteo_Controller.js');

router.get('/', getUsuariosSorteos);
router.get('/getByPk/:id_sorteo', getUsuariosBySorteoId);
router.post('/', createUsuarioSorteo);
router.patch('/:id_Usuario/:id_sorteo', modifyUsuarioSorteo);
router.delete('/:id_Usuario/:id_sorteo', deleteUsuarioSorteo);

module.exports = router;