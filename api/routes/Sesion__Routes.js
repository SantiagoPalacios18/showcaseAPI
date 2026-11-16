const express = require('express');
const router = express.Router();
const {
    getSesiones,
    getSesionById,
    createSesion,
    modifySesionById,
    deleteSesionById
} = require('../controllers/sesion_Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getSesiones);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getSesionById);
router.post('/', checkPatent("POST_REGISTER"), createSesion);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifySesionById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteSesionById);

module.exports = router;