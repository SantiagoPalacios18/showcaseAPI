const express = require('express');
const router = express.Router();
const {
    getIdiomas,
    getIdiomaById,
    createIdioma,
    modifyIdiomaById,
    deleteIdiomaById
} = require('../controllers/idioma_controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getIdiomas);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getIdiomaById);
router.post('/', checkPatent("POST_REGISTER"), createIdioma);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyIdiomaById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteIdiomaById);

module.exports = router;