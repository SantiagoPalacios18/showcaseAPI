const express = require('express');
const router = express.Router();
const {
    getPeliculasCines,
    getPeliculasByCineId,
    getPeliculaCineByPk,
    createPeliculaCine,
    modifyPeliculaCine,
    deletePeliculaCine
} = require('../controllers/pelicula_cine_Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getPeliculasCines);
router.get('/getByPk/:id_cine/:id_pelicula', checkPatent("GET_REGISTER_BY_ID"), getPeliculaCineByPk);
router.get('/getByPk/:id_cine', checkPatent("GET_REGISTERS"), getPeliculasByCineId);
router.post('/', checkPatent("POST_REGISTER"), createPeliculaCine);
router.patch('/edit/:id_cine/:id_pelicula', checkPatent("PATCH_REGISTER"), modifyPeliculaCine);
router.delete('/:id_cine/:id_pelicula', checkPatent("DELETE_REGISTER"), deletePeliculaCine);

module.exports = router;