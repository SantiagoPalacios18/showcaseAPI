const express = require('express');
const router = express.Router();
const {
    getPatentesRoles,
    getPatentesByRolId,
    getPatenteRolByPk,
    createPatenteRol,
    modifyPatenteRol,
    deletePatenteRol
} = require('../controllers/patente_rol__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getPatentesRoles);
router.get('/getByPk/:id_Rol/:id_Patente', checkPatent("GET_REGISTER_BY_ID"), getPatenteRolByPk);
router.get('/getByPk/:id_Rol', checkPatent("GET_REGISTERS"), getPatentesByRolId);
router.post('/', checkPatent("POST_REGISTER"), createPatenteRol);
router.patch('/edit/:id_Rol/:id_Patente', checkPatent("PATCH_REGISTER"), modifyPatenteRol);
router.delete('/:id_Rol/:id_Patente', checkPatent("DELETE_REGISTER"), deletePatenteRol);

module.exports = router;