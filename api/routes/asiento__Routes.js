const express = require('express');
const router = express.Router();
const {
    getAsientos,
    getAsientoById,
    createAsiento,
    modifyAsientoById,
    deleteAsientoById,
    getAsientoByFuncionId
} = require('../controllers/asiento__Controller.js');

router.get('/', getAsientos);
router.get('/getByPk/:id', getAsientoById);
router.get('/getByFuncionPk/:id', getAsientoByFuncionId);
router.post('/', createAsiento);
router.patch('/edit/:id', modifyAsientoById);
router.delete('/:id', deleteAsientoById);

module.exports = router;