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
    deletePeliculaById,
    puntuar
} = require('../controllers/pelicula__Controller.js');
router.get('/', getPeliculas);
router.get('/getByPk/:id', getPeliculaById);
router.post('/', upload.single('poster'), createPelicula);
router.patch('/edit/:id', modifyPeliculaById);
router.patch('/puntuar/:id/:punt', puntuar);
router.delete('/:id', deletePeliculaById);

module.exports = router;