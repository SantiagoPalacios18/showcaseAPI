const { Router } = require('express');
const { getUsers, getUserById, modifyuserById } = require('../controllers/usuario__Controller');

const router = Router();

router.get('/getAll', getUsers);
router.get('/getById/:id', getUserById)
router.patch('/patch/:id', modifyuserById)
//router.post('/', );

module.exports = router;