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
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getIdiomasPeliculas);
router.get('/getByPk/:id_pelicula/:id_idioma', checkPatent("GET_REGISTER_BY_ID"), getIdiomaPeliculaByPk);
router.get('/getByPk/:id_pelicula', checkPatent("GET_REGISTERS"), getIdiomasByPeliculaId);
router.post('/', checkPatent("POST_REGISTER"), createIdiomaPelicula);
router.patch('/edit/:id_pelicula/:id_idioma', checkPatent("PATCH_REGISTER"), modifyIdiomaPelicula);
router.delete('/:id_pelicula/:id_idioma', checkPatent("DELETE_REGISTER"), deleteIdiomaPelicula);

module.exports = router;