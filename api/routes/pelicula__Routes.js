const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './media/posters')
    },
    filename: function(req, file, cb){
        const name = Date.now + path.extname(file.originalname)
        cb(null, name)
    }
})

const upload = multer({storage: storage})

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
router.post('/', upload.single('poster'), authMiddleware, checkPatent("POST_REGISTER"), createPelicula);
router.patch('/edit/:id', authMiddleware, checkPatent("PATCH_REGISTER"), modifyPeliculaById);
router.delete('/:id', authMiddleware, checkPatent("DELETE_REGISTER"), deletePeliculaById);

module.exports = router;