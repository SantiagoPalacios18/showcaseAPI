const express = require('express');
const router = express.Router();
const {
    getSalas,
    getSalaById,
    createSala,
    modifySalaById,
    deleteSalaById
} = require('../controllers/sala__Controller.js');

router.get('/', getSalas);
router.get('/getByPk/:id', getSalaById);
router.post('/', createSala);
router.patch('/:id', modifySalaById);
router.delete('/:id', deleteSalaById);

module.exports = router;