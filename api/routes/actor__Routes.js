const express = require('express');
const router = express.Router();
const {
    getActores,
    getActorById,
    createActor,
    modifyActorById,
    deleteActorById
} = require('../controllers/actor_Controller.js');

router.get('/', getActores);
router.get('/:id', getActorById);
router.post('/', createActor);
router.patch('/:id', modifyActorById);
router.delete('/:id', deleteActorById);

module.exports = router;