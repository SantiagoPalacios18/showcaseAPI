const express = require('express');
const router = express.Router();
const {
    getSalas,
    getSalaById,
    createSala,
    modifySalaById,
    deleteSalaById,
    getSalaByFuncionId
} = require('../controllers/sala__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getSalas);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getSalaById);
router.get('/getByFuncionPk/:id', getSalaByFuncionId);
router.post('/', checkPatent("POST_REGISTER"), createSala);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifySalaById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteSalaById);

module.exports = router;