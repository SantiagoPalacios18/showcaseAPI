const { CompraTicket, Transaccion, Asiento } = require('../models/index.js');

// GET: Obtener compras de tickets
const getComprasTickets = async (req, res) => {
    try {
        const compras = await CompraTicket.findAll({
            include: [{ model: Transaccion }, { model: Asiento }]
        });
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener compra ticket por ID
const getCompraTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await CompraTicket.findByPk(id, {
            include: [{ model: Transaccion }, { model: Asiento }]
        });

        if (!compra) {
            return res.status(404).json({ message: `Compra ticket con el id: ${id} no encontrada` });
        }

        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear compra de ticket
const createCompraTicket = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_transaccion || !data.id_Asiento || !data.precio || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_transaccion, id_Asiento, precio o DVH)"
            });
        }

        let extra = "";
        if ("id_compraTicket" in data || "id_CompraTicket" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevaCompra = await CompraTicket.create({
            id_transaccion: data.id_transaccion,
            id_Asiento: data.id_Asiento,
            precio: data.precio,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha registrado la compra de ticket correctamente." + extra,
            compraTicket: nuevaCompra
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar compra ticket
const modifyCompraTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_transaccion" in data) datosCambiar.id_transaccion = data.id_transaccion;
        if ("id_Asiento" in data) datosCambiar.id_Asiento = data.id_Asiento;
        if ("precio" in data) datosCambiar.precio = data.precio;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await CompraTicket.update(datosCambiar, {
            where: { id_compraTicket: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Compra ticket con el id: ${id} no encontrada` });
        }

        res.status(200).json({
            message: "La compra ticket ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar compra ticket
const deleteCompraTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await CompraTicket.destroy({ where: { id_compraTicket: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la compra ticket, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la compra ticket de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getComprasTickets,
    getCompraTicketById,
    createCompraTicket,
    modifyCompraTicketById,
    deleteCompraTicketById
};