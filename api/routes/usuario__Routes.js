const { Router } = require('express');
const { getUsers, getUserById } = require('../controllers/usuario__Controller');

const router = Router();

router.get('/getAll', getUsers);
router.get('/getById/:id', getUserById)
//router.post('/', );

module.exports = router;