const { Router } = require('express');

const {
    getCines,
    getCineById,
    createCine,
    modifyCineById,
    deleteCineById
} = require('../controllers/cineController.js');

const router = Router();

router.get('/', getCines);
router.get('/:id', getCineById);
router.post('/', createCine);
router.patch('/:id', modifyCineById);
router.delete('/:id', deleteCineById);

module.exports = router;