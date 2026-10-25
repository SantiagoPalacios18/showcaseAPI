const express = require('express');
const router = express.Router();

const {
    getProductosCandy,
    getProductoCandyById,
    createProductoCandy,
    modifyProductoCandyById,
    deleteProductoCandyById
} = require('../controllers/productoCandy__Controller.js');

router.get('/', getProductosCandy);
router.get('/getByPk/:id', getProductoCandyById);
router.post('/', createProductoCandy);
router.patch('/:id', modifyProductoCandyById);
router.delete('/:id', deleteProductoCandyById);

module.exports = router;