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

router.get('/', getPeliculasCines);
router.get('/getByPk/:id_cine/:id_pelicula', getPeliculaCineByPk);
router.get('/getByPk/:id_cine', getPeliculasByCineId);
router.post('/', createPeliculaCine);
router.patch('/edit/:id_cine/:id_pelicula', modifyPeliculaCine);
router.delete('/:id_cine/:id_pelicula', deletePeliculaCine);

module.exports = router;