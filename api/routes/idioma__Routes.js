const express = require('express');
const router = express.Router();
const {
    getIdiomas,
    getIdiomaById,
    createIdioma,
    modifyIdiomaById,
    deleteIdiomaById
} = require('../controllers/idioma_controller.js');

router.get('/', getIdiomas);
router.get('/:id', getIdiomaById);
router.post('/', createIdioma);
router.patch('/:id', modifyIdiomaById);
router.delete('/:id', deleteIdiomaById);

module.exports = router;