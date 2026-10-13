const express = require('express');
const router = express.Router();
const {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById
} = require('../controllers/sorteo_controller.js');

router.get('/', getSorteos);
router.get('/:id', getSorteoById);
router.post('/', createSorteo);
router.patch('/:id', modifySorteoById);
router.delete('/:id', deleteSorteoById);

module.exports = router;