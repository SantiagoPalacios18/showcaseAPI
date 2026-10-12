const { CompraEvento } = require('../models/index.js');

// GET: Obtener todas las compras de eventos
const getComprasEventos = async (req, res) => {
    try {
        const compras = await CompraEvento.findAll();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener compra de evento por ID
const getCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await CompraEvento.findByPk(id);

        if (!compra) {
            return res.status(404).json({ message: `Compra de evento con el id: ${id} no encontrada` });
        }

        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear compra de evento
const createCompraEvento = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.id_Funcion || !data.monto || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, id_Funcion, monto o DVH)"
            });
        }

        let extra = "";
        if ("id_CompraEvento" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevaCompra = await CompraEvento.create({
            id_Usuario: data.id_Usuario,
            id_Funcion: data.id_Funcion,
            monto: data.monto,
            fecha: data.fecha || new Date(),
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha registrado la compra de evento correctamente." + extra,
            compraEvento: nuevaCompra
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar compra de evento
const modifyCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Usuario" in data) datosCambiar.id_Usuario = data.id_Usuario;
        if ("id_Funcion" in data) datosCambiar.id_Funcion = data.id_Funcion;
        if ("monto" in data) datosCambiar.monto = data.monto;
        if ("fecha" in data) datosCambiar.fecha = data.fecha;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await CompraEvento.update(datosCambiar, {
            where: { id_CompraEvento: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Compra de evento con el id: ${id} no encontrada` });
        }

        res.status(200).json({
            message: "La compra de evento ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar compra de evento
const deleteCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await CompraEvento.destroy({ where: { id_CompraEvento: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el registro, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la compra de evento de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
};