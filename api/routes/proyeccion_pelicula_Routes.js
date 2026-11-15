const express = require('express');
const router = express.Router();
const {
    getProyeccionesPeliculas,
    getProyeccionesByPeliculaId,
    getProyeccionPeliculaByPk,
    createProyeccionPelicula,
    modifyProyeccionPelicula,
    deleteProyeccionPelicula
} = require('../controllers/proyeccion_pelicula_Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getProyeccionesPeliculas);
router.get('/getByPk/:id_proyeccion/:id_pelicula', checkPatent("GET_REGISTER_BY_ID"), getProyeccionPeliculaByPk);
router.get('/getByPk/:id_pelicula', checkPatent("GET_REGISTERS"), getProyeccionesByPeliculaId);
router.post('/', checkPatent("POST_REGISTER"), createProyeccionPelicula);
router.patch('/edit/:id_proyeccion/:id_pelicula', checkPatent("PATCH_REGISTER"), modifyProyeccionPelicula);
router.delete('/:id_proyeccion/:id_pelicula', checkPatent("DELETE_REGISTER"), deleteProyeccionPelicula);

module.exports = router;