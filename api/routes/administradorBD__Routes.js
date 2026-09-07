const { Router } = require('express');
const {
    getAdministradores,
    getAdministradorById,
    createAdministrador,
    modifyAdministradorById,
    deleteAdministradorById
} = require('../controllers/administradorBDController.js');

const router = Router();

router.get('/', getAdministradores);
router.get('/:id', getAdministradorById);
router.post('/', createAdministrador);
router.patch('/:id', modifyAdministradorById);
router.delete('/:id', deleteAdministradorById);

module.exports = router;