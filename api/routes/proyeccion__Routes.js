const express = require('express');
const router = express.Router();
const {
    getProyecciones,
    getProyeccionById,
    createProyeccion,
    modifyProyeccionById,
    deleteProyeccionById
} = require('../controllers/proyeccion__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getProyecciones);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getProyeccionById);
router.post('/', checkPatent("POST_REGISTER"), createProyeccion);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyProyeccionById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteProyeccionById);

module.exports = router;