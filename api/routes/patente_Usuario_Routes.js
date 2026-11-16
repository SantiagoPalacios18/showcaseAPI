const express = require('express');
const router = express.Router();
const {
    getPatentesUsuarios,
    getPatentesByUsuarioId,
    getPatenteUsuarioByPk,
    createPatenteUsuario,
    modifyPatenteUsuario,
    deletePatenteUsuario
} = require('../controllers/patente_Usuario_Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getPatentesUsuarios);
router.get('/getByPk/:id_Usuario/:id_Patente', checkPatent("GET_REGISTER_BY_ID"), getPatenteUsuarioByPk);
router.get('/getByPk/:id_Usuario', checkPatent("GET_REGISTERS"), getPatentesByUsuarioId);
router.post('/', checkPatent("POST_REGISTER"), createPatenteUsuario);
router.patch('/edit/:id_Usuario/:id_Patente', checkPatent("PATCH_REGISTER"), modifyPatenteUsuario);
router.delete('/:id_Usuario/:id_Patente', checkPatent("DELETE_REGISTER"), deletePatenteUsuario);

module.exports = router;