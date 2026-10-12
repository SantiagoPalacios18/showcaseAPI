const { SoporteTecnico } = require('../models/index.js');

// GET: Obtener todos los tickets de soporte
const getSoporteTecnico = async (req, res) => {
    try {
        const soportes = await SoporteTecnico.findAll();
        res.status(200).json(soportes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener soporte por ID
const getSoporteTecnicoById = async (req, res) => {
    try {
        const { id } = req.params;
        const soporte = await SoporteTecnico.findByPk(id);

        if (!soporte) {
            return res.status(404).json({ message: `Ticket de soporte con el id: ${id} no encontrado` });
        }

        res.status(200).json(soporte);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear ticket de soporte
const createSoporteTecnico = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.motivo || !data.descripcion || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, motivo, descripcion o DVH)"
            });
        }

        let extra = "";
        if ("id_soporteTecnico" in data || "id_SoporteTecnico" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevoSoporte = await SoporteTecnico.create({
            id_Usuario: data.id_Usuario,
            motivo: data.motivo,
            descripcion: data.descripcion,
            estado: data.estado || "Abierto",
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha registrado el ticket de soporte correctamente." + extra,
            soporteTecnico: nuevoSoporte
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar soporte
const modifySoporteTecnicoById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Usuario" in data) datosCambiar.id_Usuario = data.id_Usuario;
        if ("motivo" in data) datosCambiar.motivo = data.motivo;
        if ("descripcion" in data) datosCambiar.descripcion = data.descripcion;
        if ("estado" in data) datosCambiar.estado = data.estado;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await SoporteTecnico.update(datosCambiar, {
            where: { id_soporteTecnico: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Ticket de soporte con el id: ${id} no encontrado` });
        }

        res.status(200).json({
            message: "El ticket de soporte ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar soporte
const deleteSoporteTecnicoById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await SoporteTecnico.destroy({ where: { id_soporteTecnico: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el ticket de soporte, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el ticket de soporte de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSoporteTecnico,
    getSoporteTecnicoById,
    createSoporteTecnico,
    modifySoporteTecnicoById,
    deleteSoporteTecnicoById
};