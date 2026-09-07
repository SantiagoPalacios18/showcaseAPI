const { Router } = require('express');
const {
    getAsientos,
    getAsientoById,
    createAsiento,
    modifyAsientoById,
    deleteAsientoById
} = require('../controllers/asientoController.js');

const router = Router();

router.get('/', getAsientos);
router.get('/:id', getAsientoById);
router.post('/', createAsiento);
router.patch('/:id', modifyAsientoById);
router.delete('/:id', deleteAsientoById);

module.exports = router;