const express = require('express');
const router = express.Router();
const {
    getActores,
    getActorById,
    createActor,
    modifyActorById,
    deleteActorById
} = require('../controllers/actor_Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getActores);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getActorById);
router.post('/', checkPatent("POST_REGISTER"), createActor);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyActorById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteActorById);

module.exports = router;