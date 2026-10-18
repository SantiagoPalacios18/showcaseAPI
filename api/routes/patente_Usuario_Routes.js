const express = require('express');
const router = express.Router();
const {
    getPatentesUsuarios,
    getPatentesByUsuarioId,
    createPatenteUsuario,
    modifyPatenteUsuario,
    deletePatenteUsuario
} = require('../controllers/patente_Usuario_Controller.js');

router.get('/', getPatentesUsuarios);
router.get('/:id_Usuario', getPatentesByUsuarioId);
router.post('/', createPatenteUsuario);
router.patch('/:id_Usuario/:id_Patente', modifyPatenteUsuario);
router.delete('/:id_Usuario/:id_Patente', deletePatenteUsuario);

module.exports = router;