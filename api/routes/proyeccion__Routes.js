const express = require('express');
const router = express.Router();
const {
    getProyecciones,
    getProyeccionById,
    createProyeccion,
    modifyProyeccionById,
    deleteProyeccionById
} = require('../controllers/proyeccion__Controller.js');

router.get('/', getProyecciones);
router.get('/:id', getProyeccionById);
router.post('/', createProyeccion);
router.patch('/:id', modifyProyeccionById);
router.delete('/:id', deleteProyeccionById);

module.exports = router;