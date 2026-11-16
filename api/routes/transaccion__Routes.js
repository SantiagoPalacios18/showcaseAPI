const express = require('express');
const router = express.Router();
const {
    getTransacciones,
    getTransaccionById,
    createTransaccion,
    modifyTransaccionById,
    deleteTransaccionById
} = require('../controllers/transaccion_controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getTransacciones);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getTransaccionById);
router.post('/', checkPatent("POST_REGISTER"), createTransaccion);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyTransaccionById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteTransaccionById);

module.exports = router;