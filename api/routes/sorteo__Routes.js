const express = require('express');
const router = express.Router();
const {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById,
    getElegirGanador
} = require('../controllers/sorteo_controller.js');
const {authMiddleware, checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/getGanador/:id', getElegirGanador)
router.get('/', authMiddleware, checkPatent("GET_REGISTERS"), getSorteos);
router.get('/getByPk/:id', authMiddleware, checkPatent("GET_REGISTER_BY_ID"), getSorteoById);
router.post('/', authMiddleware, checkPatent("POST_REGISTER"), createSorteo);
router.patch('/edit/:id', authMiddleware, checkPatent("PATCH_REGISTER"), modifySorteoById);
router.delete('/:id', authMiddleware, checkPatent("DELETE_REGISTER"), deleteSorteoById);

module.exports = router;