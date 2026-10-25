const express = require('express');
const router = express.Router();
const {
    getComprasTickets,
    getCompraTicketById,
    createCompraTicket,
    modifyCompraTicketById,
    deleteCompraTicketById
} = require('../controllers/compraTicket_controller.js');

router.get('/', getComprasTickets);
router.get('/getByPk/:id', getCompraTicketById);
router.post('/', createCompraTicket);
router.patch('/:id', modifyCompraTicketById);
router.delete('/:id', deleteCompraTicketById);

module.exports = router;