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

router.get('/', getFunciones);
router.get('/getByPk/:id', getFuncionById);
router.post('/', createFuncion);
router.patch('/edit/:id', modifyFuncionById);
router.delete('/:id', deletefuncionById);
router.get('/getByPkPeli/:id', getFuncionesByIdPelicula);

module.exports = router;