const express = require('express');
const router = express.Router();
const {
    getPeliculasCines,
    getPeliculasByCineId,
    createPeliculaCine,
    modifyPeliculaCine,
    deletePeliculaCine
} = require('../controllers/pelicula_cine_Controller.js');

router.get('/', getPeliculasCines);
router.get('/getByPk/:id_Cine', getPeliculasByCineId);
router.post('/', createPeliculaCine);
router.patch('/:id_Pelicula/:id_Cine', modifyPeliculaCine);
router.delete('/:id_Pelicula/:id_Cine', deletePeliculaCine);

module.exports = router;