const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    modifyuserById,
    deleteuserById
} = require('../controllers/usuario__Controller.js');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', modifyuserById);
router.delete('/:id', deleteuserById);

module.exports = router;