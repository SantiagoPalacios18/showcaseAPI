const express = require('express');
const router = express.Router();
const {
    getIdiomasPeliculas,
    getIdiomasByPeliculaId,
    createIdiomaPelicula,
    modifyIdiomaPelicula,
    deleteIdiomaPelicula
} = require('../controllers/idioma_pelicula_Controller.js');

router.get('/', getIdiomasPeliculas);
router.get('/:id_pelicula', getIdiomasByPeliculaId);
router.post('/', createIdiomaPelicula);
router.patch('/:id_pelicula/:id_idioma', modifyIdiomaPelicula);
router.delete('/:id_pelicula/:id_idioma', deleteIdiomaPelicula);

module.exports = router;