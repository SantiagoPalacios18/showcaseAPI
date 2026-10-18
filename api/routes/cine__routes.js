const express = require('express');
const router = express.Router();
const {
    getCines,
    getCineById,
    createCine,
    modifyCineById,
    deleteCineById
} = require('../controllers/cine__Controller.js');

router.get('/', getCines);
router.get('/:id', getCineById);
router.post('/', createCine);
router.patch('/:id', modifyCineById);
router.delete('/:id', deleteCineById);

module.exports = router;