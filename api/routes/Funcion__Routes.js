const express = require('express');
const router = express.Router();

const {
    getFunciones,
    getFuncionById,
    createFuncion,
    modifyFuncionById,
    deletefuncionById,
    getFuncionesByIdPelicula
} = require('../controllers/funcion__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getFunciones);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getFuncionById);
router.post('/', checkPatent("POST_REGISTER"), createFuncion);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyFuncionById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deletefuncionById);
router.get('/getByPkPeli/:id', getFuncionesByIdPelicula);

module.exports = router;