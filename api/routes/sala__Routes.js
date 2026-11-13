const express = require('express');
const router = express.Router();
const {
    getSalas,
    getSalaById,
    createSala,
    modifySalaById,
    deleteSalaById,
    getSalaByFuncionId
} = require('../controllers/sala__Controller.js');

router.get('/', getSalas);
router.get('/getByPk/:id', getSalaById);
router.get('/getByFuncionPk/:id', getSalaByFuncionId);
router.post('/', createSala);
router.patch('/edit/:id', modifySalaById);
router.delete('/:id', deleteSalaById);

module.exports = router;