const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    modifyuserById,
    deleteuserById,
    createTestUser,
    getBuscarUsuarioPelicula
} = require('../controllers/usuario__Controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS") ,getUsers);
router.get('/getByPk/:id', (req, res, next) =>{
    // Si el usuario buscado es del propio usuario, se lo dejamos pasar (esto es para evitar problemas con el profile.jsx)
    if (Number(req.params.id) == Number(req.user.id_Usuario)) return next()
    return checkPatent("GET_USER_BY_ID")(req,res,next) // Le tengo que pasar el req res y next para que termine la llamada y devuelva el res, sino queda colgado
},getUserById);

router.get('/:id', getBuscarUsuarioPelicula)
router.post('/', checkPatent("POST_REGISTER"), createUser);
router.patch('/edit/:id',checkPatent("PATCH_REGISTER"), modifyuserById);
router.delete('/:id',checkPatent("DELETE_REGISTER"), deleteuserById);
router.post('/test',checkPatent("POST_USER_TEST"), createTestUser)

module.exports = router;