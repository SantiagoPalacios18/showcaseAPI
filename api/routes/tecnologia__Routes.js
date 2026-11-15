const express = require('express');
const router = express.Router();
const {
    getTecnologias,
    getTecnologiaById,
    createTecnologia,
    modifyTecnologiaById,
    deleteTecnologiaById
} = require('../controllers/tecnologia_controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getTecnologias);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getTecnologiaById);
router.post('/', checkPatent("POST_REGISTER"), createTecnologia);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyTecnologiaById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteTecnologiaById);

module.exports = router;