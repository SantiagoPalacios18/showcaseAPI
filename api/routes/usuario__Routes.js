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
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_USERS") ,getUsers);
router.get('/getByPk/:id', (req, res, next) =>{
    // Si el usuario buscado es del propio usuario, se lo dejamos pasar (esto es para evitar problemas con el profile.jsx)
    if (Number(req.params.id) == Number(req.user.id_Usuario)) return next()
    else return checkPatent("GET_USER_BY_ID")
}
    
,getUserById);
router.post('/', checkPatent("POST_USER"), createUser);
router.patch('/edit/:id',checkPatent("PATCH_USER"), modifyuserById);
router.delete('/:id',checkPatent("DELETE_USER"), deleteuserById);
router.post('/test',checkPatent("POST_USER_TEST"), createTestUser)

module.exports = router;