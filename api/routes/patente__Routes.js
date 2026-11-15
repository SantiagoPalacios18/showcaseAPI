const express = require('express');
const router = express.Router();
const {
    getPatentes,
    getPatenteById,
    createPatente,
    modifyPatenteById,
    deletePatenteById
} = require('../controllers/patente__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getPatentes);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getPatenteById);
router.post('/', checkPatent("POST_REGISTER"), createPatente);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyPatenteById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deletePatenteById);

module.exports = router;