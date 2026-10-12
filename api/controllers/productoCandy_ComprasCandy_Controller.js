const { ProductoCandy_ComprasCandy } = require('../models/index.js');

// GET: Obtener todos los detalles de productos por compra
const getDetallesCandy = async (req, res) => {
    try {
        const registros = await ProductoCandy_ComprasCandy.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener productos de una compra específica
const getDetallesByCompraId = async (req, res) => {
    try {
        const { id_compraCandy } = req.params;
        const registros = await ProductoCandy_ComprasCandy.findAll({
            where: { id_compraCandy }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron items para la compra: ${id_compraCandy}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Agregar un producto a una compra
const createDetalleCandy = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_compraCandy || !data.id_productoCandy || !data.cantidad || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_compraCandy, id_productoCandy, cantidad o DVH)"
            });
        }

        const nuevoDetalle = await ProductoCandy_ComprasCandy.create({
            id_compraCandy: data.id_compraCandy,
            id_productoCandy: data.id_productoCandy,
            cantidad: data.cantidad,
            precioUnitario: data.precioUnitario || 0,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Item agregado a la compra correctamente.",
            detalleCandy: nuevoDetalle
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar cantidad/DVH de un producto en la compra
const modifyDetalleCandy = async (req, res) => {
    try {
        const { id_compraCandy, id_productoCandy } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("cantidad" in data) datosCambiar.cantidad = data.cantidad;
        if ("precioUnitario" in data) datosCambiar.precioUnitario = data.precioUnitario;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await ProductoCandy_ComprasCandy.update(datosCambiar, {
            where: { id_compraCandy, id_productoCandy }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Detalle no encontrado para modificar" });
        }

        res.status(200).json({
            message: "Detalle modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Quitar producto de una compra
const deleteDetalleCandy = async (req, res) => {
    try {
        const { id_compraCandy, id_productoCandy } = req.params;
        const eliminadas = await ProductoCandy_ComprasCandy.destroy({
            where: { id_compraCandy, id_productoCandy }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el detalle a eliminar" });
        }

        res.status(200).json({
            message: `Producto ${id_productoCandy} eliminado de la compra ${id_compraCandy} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDetallesCandy,
    getDetallesByCompraId,
    createDetalleCandy,
    modifyDetalleCandy,
    deleteDetalleCandy
};