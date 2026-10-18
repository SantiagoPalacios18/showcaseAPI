const express = require('express');
const router = express.Router();
const {
    getSesiones,
    getSesionById,
    createSesion,
    modifySesionById,
    deleteSesionById
} = require('../controllers/sesion_Controller.js');

router.get('/', getSesiones);
router.get('/:id', getSesionById);
router.post('/', createSesion);
router.patch('/:id', modifySesionById);
router.delete('/:id', deleteSesionById);

module.exports = router;