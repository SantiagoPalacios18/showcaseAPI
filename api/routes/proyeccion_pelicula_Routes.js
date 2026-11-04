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

router.get('/', getProyeccionesPeliculas);
router.get('/getByPk/:id_proyeccion/:id_pelicula', getProyeccionPeliculaByPk);
router.get('/getByPk/:id_pelicula', getProyeccionesByPeliculaId);
router.post('/', createProyeccionPelicula);
router.patch('/edit/:id_proyeccion/:id_pelicula', modifyProyeccionPelicula);
router.delete('/:id_proyeccion/:id_pelicula', deleteProyeccionPelicula);

module.exports = router;