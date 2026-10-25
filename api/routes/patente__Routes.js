const express = require('express');
const router = express.Router();
const {
    getPatentes,
    getPatenteById,
    createPatente,
    modifyPatenteById,
    deletePatenteById
} = require('../controllers/patente__Controller.js');

router.get('/', getPatentes);
router.get('/getByPk/:id', getPatenteById);
router.post('/', createPatente);
router.patch('/:id', modifyPatenteById);
router.delete('/:id', deletePatenteById);

module.exports = router;