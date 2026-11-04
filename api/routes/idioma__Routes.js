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
router.get('/getByPk/:id', getIdiomaById);
router.post('/', createIdioma);
router.patch('/edit/:id', modifyIdiomaById);
router.delete('/:id', deleteIdiomaById);

module.exports = router;