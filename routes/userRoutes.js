const { Router } = require('express');
const {
    getUsers,
    getUserById,
    getUsersByName,
    getUsersWithHobbies,
    createUser,
    putUserbyId,
    modifyUsersById,
    deleteUserById, 
} = require('../controllers/userController');

const router = Router();
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/nombre/:name', getUsersByName);
router.get('/:id/hobbies',  getUsersWithHobbies);
router.post('/create-user', createUser);
router.put("/:id", putUserbyId);
router.patch("/:id", modifyUsersById );
router.delete("/:id", deleteUserById);






module.exports = router;