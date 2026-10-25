const express = require('express');
const router = express.Router();
const {
    getTecnologias,
    getTecnologiaById,
    createTecnologia,
    modifyTecnologiaById,
    deleteTecnologiaById
} = require('../controllers/tecnologia_controller.js');

router.get('/', getTecnologias);
router.get('/getByPk/:id', getTecnologiaById);
router.post('/', createTecnologia);
router.patch('/:id', modifyTecnologiaById);
router.delete('/:id', deleteTecnologiaById);

module.exports = router;