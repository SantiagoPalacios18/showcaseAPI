const express = require('express');
const router = express.Router();
const {
    getActoresPeliculas,
    getActoresByPeliculaId,
    getActorPeliculaByPk,
    createActorPelicula,
    modifyActorPelicula,
    deleteActorPelicula
} = require('../controllers/actor_pelicula_controller.js');

router.get('/', getActoresPeliculas);
router.get('/getByPk/:id_Actor/:id_Pelicula', getActorPeliculaByPk);
router.get('/getByPk/:id_Pelicula', getActoresByPeliculaId);
router.post('/', createActorPelicula);
router.patch('/edit/:id_Actor/:id_Pelicula', modifyActorPelicula);
router.delete('/:id_Actor/:id_Pelicula', deleteActorPelicula);

module.exports = router;