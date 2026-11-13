const { ProductoCandy_ComprasCandy } = require('../models/index.js');

const getDetallesCandy = async (req, res) => {
    try {
        const registros = await ProductoCandy_ComprasCandy.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDetallesByCompraId = async (req, res) => {
    try {
        const { id_ComprasCandy } = req.params;
        const registros = await ProductoCandy_ComprasCandy.findAll({
            where: { id_ComprasCandy }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron items para la compra: ${id_ComprasCandy}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getDetalleCandyByPk = async (req, res) => {
    try {
        const { id_ComprasCandy, id_ProductoCandy } = req.params;
        const registro = await ProductoCandy_ComprasCandy.findOne({
            where: { id_ComprasCandy, id_ProductoCandy }
        });

        if (!registro) {
            return res.status(404).json({ message: "Detalle no encontrado" });
        }

        res.status(200).json(registro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createDetalleCandy = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_ComprasCandy || !data.id_ProductoCandy || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_ComprasCandy, id_ProductoCandy o DVH)"
            });
        }

        const nuevoDetalle = await ProductoCandy_ComprasCandy.create({
            id_ComprasCandy: data.id_ComprasCandy,
            id_ProductoCandy: data.id_ProductoCandy,
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

const modifyDetalleCandy = async (req, res) => {
    try {
        const { id_ComprasCandy, id_ProductoCandy } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await ProductoCandy_ComprasCandy.update(datosCambiar, {
            where: { id_ComprasCandy, id_ProductoCandy }
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

const deleteDetalleCandy = async (req, res) => {
    try {
        const { id_ComprasCandy, id_ProductoCandy } = req.params;
        const eliminadas = await ProductoCandy_ComprasCandy.destroy({
            where: { id_ComprasCandy, id_ProductoCandy }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el detalle a eliminar" });
        }

        res.status(200).json({
            message: `Producto ${id_ProductoCandy} eliminado de la compra ${id_ComprasCandy} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getDetallesCandy,
    getDetallesByCompraId,
    getDetalleCandyByPk,
    createDetalleCandy,
    modifyDetalleCandy,
    deleteDetalleCandy
};
