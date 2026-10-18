const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    modifyUsuarioById,
    deleteUsuarioById
} = require('../controllers/usuario__Controller.js');

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.patch('/:id', modifyUsuarioById);
router.delete('/:id', deleteUsuarioById);

module.exports = router;