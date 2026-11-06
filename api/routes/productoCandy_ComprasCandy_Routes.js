const express = require('express');
const router = express.Router();

const {
    getDetallesCandy,
    getDetallesByCompraId,
    getDetalleCandyByPk,
    createDetalleCandy,
    modifyDetalleCandy,
    deleteDetalleCandy
} = require('../controllers/productoCandy_ComprasCandy_Controller.js');

router.get('/', getDetallesCandy);
router.get('/getByPk/:id_ComprasCandy/:id_ProductoCandy', getDetalleCandyByPk);
router.get('/getByPk/:id_ComprasCandy', getDetallesByCompraId);
router.post('/', createDetalleCandy);
router.patch('/edit/:id_ComprasCandy/:id_ProductoCandy', modifyDetalleCandy);
router.delete('/:id_ComprasCandy/:id_ProductoCandy', deleteDetalleCandy);

module.exports = router;
