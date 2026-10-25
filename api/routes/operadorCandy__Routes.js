const express = require('express');
const router = express.Router();
const {
    getOperadoresCandy,
    getOperadorCandyById,
    createOperadorCandy,
    modifyOperadorCandyById,
    deleteOperadorCandyById
} = require('../controllers/operadorCandy__Controller.js');

router.get('/', getOperadoresCandy);
router.get('/getByPk/:id', getOperadorCandyById);
router.post('/', createOperadorCandy);
router.patch('/:id', modifyOperadorCandyById);
router.delete('/:id', deleteOperadorCandyById);

module.exports = router;