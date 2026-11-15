const express = require('express');
const router = express.Router();
const {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    modifyPeliculaById,
    deletePeliculaById
} = require('../controllers/pelicula__Controller.js');
const {authMiddleware, checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', authMiddleware, checkPatent("GET_REGISTERS"), getPeliculas);
router.get('/getByPk/:id', authMiddleware, checkPatent("GET_REGISTER_BY_ID"), getPeliculaById);
router.post('/', authMiddleware, checkPatent("POST_REGISTER"), createPelicula);
router.patch('/edit/:id', authMiddleware, checkPatent("PATCH_REGISTER"), modifyPeliculaById);
router.delete('/:id', authMiddleware, checkPatent("DELETE_REGISTER"), deletePeliculaById);

module.exports = router;