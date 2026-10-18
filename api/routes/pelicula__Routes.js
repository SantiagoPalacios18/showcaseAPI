const express = require('express');
const router = express.Router();
const {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    modifyPeliculaById,
    deletePeliculaById
} = require('../controllers/pelicula__Controller.js');

router.get('/', getPeliculas);
router.get('/:id', getPeliculaById);
router.post('/', createPelicula);
router.patch('/:id', modifyPeliculaById);
router.delete('/:id', deletePeliculaById);

module.exports = router;