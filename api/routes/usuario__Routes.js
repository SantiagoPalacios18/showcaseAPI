const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    modifyuserById,
    deleteuserById,
    createTestUser
} = require('../controllers/usuario__Controller.js');

router.get('/', getUsers);
router.get('/getById/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', modifyuserById);
router.delete('/:id', deleteuserById);
router.post('/test', createTestUser)

module.exports = router;