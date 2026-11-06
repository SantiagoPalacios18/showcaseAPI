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

router.get('/', getPatentesRoles);
router.get('/getByPk/:id_Rol/:id_Patente', getPatenteRolByPk);
router.get('/getByPk/:id_Rol', getPatentesByRolId);
router.post('/', createPatenteRol);
router.patch('/edit/:id_Rol/:id_Patente', modifyPatenteRol);
router.delete('/:id_Rol/:id_Patente', deletePatenteRol);

module.exports = router;