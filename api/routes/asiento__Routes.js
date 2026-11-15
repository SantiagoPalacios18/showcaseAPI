const express = require('express');
const router = express.Router();
const {
    getAsientos,
    getAsientoById,
    createAsiento,
    modifyAsientoById,
    deleteAsientoById,
    getAsientoByFuncionId
} = require('../controllers/asiento__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getAsientos);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getAsientoById);
router.get('/getByFuncionPk/:id', getAsientoByFuncionId);
router.post('/', checkPatent("POST_REGISTER"), createAsiento);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyAsientoById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteAsientoById);

module.exports = router;