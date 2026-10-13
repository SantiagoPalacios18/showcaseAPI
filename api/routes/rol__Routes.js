const express = require('express');
const router = express.Router();
const {
    getRoles,
    getRolById,
    createRol,
    modifyRolById,
    deleteRolById
} = require('../controllers/rol__Controller.js');

router.get('/', getRoles);
router.get('/:id', getRolById);
router.post('/', createRol);
router.patch('/:id', modifyRolById);
router.delete('/:id', deleteRolById);

module.exports = router;