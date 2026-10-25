const express = require('express');
const router = express.Router();
const {
    getProyeccionesPeliculas,
    getProyeccionesByPeliculaId,
    createProyeccionPelicula,
    modifyProyeccionPelicula,
    deleteProyeccionPelicula
} = require('../controllers/proyeccion_pelicula_Controller.js');

router.get('/', getProyeccionesPeliculas);
router.get('/getByPk/:id_pelicula', getProyeccionesByPeliculaId);
router.post('/', createProyeccionPelicula);
router.patch('/:id_pelicula/:id_proyeccion', modifyProyeccionPelicula);
router.delete('/:id_pelicula/:id_proyeccion', deleteProyeccionPelicula);

module.exports = router;