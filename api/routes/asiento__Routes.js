const express = require('express');
const router = express.Router();
const {
    getAsientos,
    getAsientoById,
    createAsiento,
    modifyAsientoById,
    deleteAsientoById
} = require('../controllers/asiento__Controller.js');

router.get('/', getAsientos);
router.get('/:id', getAsientoById);
router.post('/', createAsiento);
router.patch('/:id', modifyAsientoById);
router.delete('/:id', deleteAsientoById);

module.exports = router;