const express = require('express');
const router = express.Router();

const {
    getFunciones,
    getFuncionById,
    createFuncion,
    modifyFuncionById,
    deletefuncionById
} = require('../controllers/funcion__Controller.js');

router.get('/', getFunciones);
router.get('/getByPk/:id', getFuncionById);
router.post('/', createFuncion);
router.patch('/:id', modifyFuncionById);
router.delete('/:id', deletefuncionById);

module.exports = router;