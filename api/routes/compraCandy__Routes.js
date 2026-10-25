const express = require('express');
const router = express.Router();

const {
    getComprasCandy,
    getCompraCandyById,
    createCompraCandy,
    modifyCompraCandyById,
    deleteCompraCandyById
} = require('../controllers/compraCandy__Controller.js');

router.get('/', getComprasCandy);
router.get('/getByPk/:id', getCompraCandyById);
router.post('/', createCompraCandy);
router.patch('/:id', modifyCompraCandyById);
router.delete('/:id', deleteCompraCandyById);

module.exports = router;