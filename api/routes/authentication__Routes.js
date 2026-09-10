const { Router } = require('express');
const bcrypt = require("bcrypt")

const {
    login,
    register,
    me,
    refresh,
    logout
}= require('../controllers/authentication__Controller.js');

const { authMiddleware } = require('../middlewares/auth__Middleware.js');



const router = Router();
router.post('/login', login);
router.post('/register',register); 
router.get('/me', authMiddleware, me);
router.post('/refresh', refresh )
router.post('/logout', logout )


module.exports = router;