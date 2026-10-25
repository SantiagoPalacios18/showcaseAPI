const express = require('express');
const router = express.Router();
const {
    getTransacciones,
    getTransaccionById,
    createTransaccion,
    modifyTransaccionById,
    deleteTransaccionById
} = require('../controllers/transaccion_controller.js');

router.get('/', getTransacciones);
router.get('/getByPk/:id', getTransaccionById);
router.post('/', createTransaccion);
router.patch('/:id', modifyTransaccionById);
router.delete('/:id', deleteTransaccionById);

module.exports = router;