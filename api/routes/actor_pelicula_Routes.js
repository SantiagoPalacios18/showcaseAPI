const express = require('express');
const router = express.Router();
const {
    getActoresPeliculas,
    getActoresByPeliculaId,
    createActorPelicula,
    modifyActorPelicula,
    deleteActorPelicula
} = require('../controllers/actor_pelicula_controller.js');

router.get('/', getActoresPeliculas);
router.get('/:id_Pelicula', getActoresByPeliculaId);
router.post('/', createActorPelicula);
router.patch('/:id_Actor/:id_Pelicula', modifyActorPelicula);
router.delete('/:id_Actor/:id_Pelicula', deleteActorPelicula);

module.exports = router;