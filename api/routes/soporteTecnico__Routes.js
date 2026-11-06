const express = require('express');
const router = express.Router();
const {
    getSoporteTecnico,
    getSoporteTecnicoById,
    createSoporteTecnico,
    modifySoporteTecnicoById,
    deleteSoporteTecnicoById
} = require('../controllers/soporteTecnico_controller.js');

router.get('/', getSoporteTecnico);
router.get('/getByPk/:id', getSoporteTecnicoById);
router.post('/', createSoporteTecnico);
router.patch('/edit/:id', modifySoporteTecnicoById);
router.delete('/:id', deleteSoporteTecnicoById);

module.exports = router;