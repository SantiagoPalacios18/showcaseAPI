const { Transaccion, Usuario } = require('../models/index.js');

// GET: Obtener todas las transacciones
const getTransacciones = async (req, res) => {
    try {
        const transacciones = await Transaccion.findAll({
            include: [{ model: Usuario, attributes: ['id_Usuario', 'nombre', 'apellido', 'email'] }]
        });
        res.status(200).json(transacciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener transaccion por ID
const getTransaccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaccion = await Transaccion.findByPk(id, {
            include: [{ model: Usuario, attributes: ['id_Usuario', 'nombre', 'apellido', 'email'] }]
        });

        if (!transaccion) {
            return res.status(404).json({ message: `Transaccion con el id: ${id} no encontrada` });
        }

        res.status(200).json(transaccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear transaccion
const createTransaccion = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.monto || !data.fecha || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, monto, fecha o DVH)"
            });
        }

        let extra = "";
        if ("id_transaccion" in data || "id_Transaccion" in data) {
            extra = " Alerta: El ID de transacción no es modificable, se estableció otro";
        }

        const nuevaTransaccion = await Transaccion.create({
            id_Usuario: data.id_Usuario,
            monto: data.monto,
            fecha: data.fecha,
            metodoPago: data.metodoPago || 'Efectivo',
            estado: data.estado || 'Aprobada',
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha creado la transacción correctamente." + extra,
            transaccion: nuevaTransaccion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar transaccion
const modifyTransaccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Usuario" in data) datosCambiar.id_Usuario = data.id_Usuario;
        if ("monto" in data) datosCambiar.monto = data.monto;
        if ("fecha" in data) datosCambiar.fecha = data.fecha;
        if ("metodoPago" in data) datosCambiar.metodoPago = data.metodoPago;
        if ("estado" in data) datosCambiar.estado = data.estado;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Transaccion.update(datosCambiar, {
            where: { id_transaccion: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Transaccion con el id: ${id} no encontrada` });
        }

        res.status(200).json({
            message: "La transaccion ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar transaccion
const deleteTransaccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Transaccion.destroy({ where: { id_transaccion: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la transaccion, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la transacción de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTransacciones,
    getTransaccionById,
    createTransaccion,
    modifyTransaccionById,
    deleteTransaccionById
};