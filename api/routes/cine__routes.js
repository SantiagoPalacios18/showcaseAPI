const express = require('express');
const router = express.Router();
const {
    getCines,
    getCineById,
    createCine,
    modifyCineById,
    deleteCineById
} = require('../controllers/cine__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getCines);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getCineById);
router.post('/', checkPatent("POST_REGISTER"), createCine);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyCineById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteCineById);

module.exports = router;