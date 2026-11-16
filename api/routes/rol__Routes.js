const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRolById,
    createRol,
    modifyRolById,
    deleteRolById
} = require('../controllers/rol__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getRoles);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getRolById);
router.post('/', checkPatent("POST_REGISTER"), createRol);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyRolById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteRolById);

module.exports = router;