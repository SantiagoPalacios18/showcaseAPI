const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './media/sorteos')
    },
    filename: function(req, file, cb){
        const name = Date.now() + path.extname(file.originalname)
        cb(null, name)
    }
})

const upload = multer({storage: storage})

const {
    getSorteos,
    getSorteoById,
    getBuscarGanador,
    createSorteo,
    modifySorteoById,
    deleteSorteoById
} = require('../controllers/sorteo_controller.js');

router.get('/', getSorteos);
router.get('/getByPk/:id', getSorteoById);
router.get('/getGanador/:id', getBuscarGanador)
router.post('/', upload.single('imagen'), createSorteo);
router.patch('/edit/:id', modifySorteoById);
router.delete('/:id', deleteSorteoById);

module.exports = router;