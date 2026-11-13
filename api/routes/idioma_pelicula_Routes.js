const express = require('express');
const router = express.Router();
const {
    getIdiomasPeliculas,
    getIdiomasByPeliculaId,
    getIdiomaPeliculaByPk,
    createIdiomaPelicula,
    modifyIdiomaPelicula,
    deleteIdiomaPelicula
} = require('../controllers/idioma_pelicula_Controller.js');

router.get('/', getIdiomasPeliculas);
router.get('/getByPk/:id_pelicula/:id_idioma', getIdiomaPeliculaByPk);
router.get('/getByPk/:id_pelicula', getIdiomasByPeliculaId);
router.post('/', createIdiomaPelicula);
router.patch('/edit/:id_pelicula/:id_idioma', modifyIdiomaPelicula);
router.delete('/:id_pelicula/:id_idioma', deleteIdiomaPelicula);

module.exports = router;