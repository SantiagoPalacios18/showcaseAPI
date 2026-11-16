const { Router } = require('express');
const { checkPatent } = require('../middlewares/auth__Middleware.js');
const { ejecutarSQL } = require('../controllers/sql__Controller.js');

const router = Router();

router.post('/', checkPatent('ADMIN_SQL'), ejecutarSQL);

module.exports = router;
