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
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getActoresPeliculas);
router.get('/getByPk/:id_Actor/:id_Pelicula', checkPatent("GET_REGISTER_BY_ID"), getActorPeliculaByPk);
router.get('/getByPk/:id_Pelicula', checkPatent("GET_REGISTERS"), getActoresByPeliculaId);
router.post('/', checkPatent("POST_REGISTER"), createActorPelicula);
router.patch('/edit/:id_Actor/:id_Pelicula', checkPatent("PATCH_REGISTER"), modifyActorPelicula);
router.delete('/:id_Actor/:id_Pelicula', checkPatent("DELETE_REGISTER"), deleteActorPelicula);

module.exports = router;