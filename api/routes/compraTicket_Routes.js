const express = require('express');
const router = express.Router();
const {
    getComprasTickets,
    getCompraTicketById,
    createCompraTicket,
    modifyCompraTicketById,
    deleteCompraTicketById
} = require('../controllers/compraTicket_controller.js');
const {checkPatent} = require('../middlewares/auth__Middleware.js')

router.get('/', checkPatent("GET_REGISTERS"), getComprasTickets);
router.get('/getByPk/:id', checkPatent("GET_REGISTER_BY_ID"), getCompraTicketById);
router.post('/', checkPatent("POST_REGISTER"), createCompraTicket);
router.patch('/edit/:id', checkPatent("PATCH_REGISTER"), modifyCompraTicketById);
router.delete('/:id', checkPatent("DELETE_REGISTER"), deleteCompraTicketById);

module.exports = router;