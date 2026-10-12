const { Sala } = require('../models/index.js');

// GET: Obtener todas las salas
const getSalas = async (req, res) => {
    try {
        const salas = await Sala.findAll();
        res.status(200).json(salas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener una sala por ID
const getSalaById = async (req, res) => {
    try {
        const { id } = req.params;
        const sala = await Sala.findByPk(id);

        if (!sala) {
            return res.status(404).json({ message: `Sala con el id: ${id} no encontrada` });
        }

        res.status(200).json(sala);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear una nueva sala
const createSala = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Cine || !data.nombre || !data.capacidad || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Cine, nombre, capacidad o DVH)"
            });
        }

        let extra = "";
        if ("id_Sala" in data) {
            extra = " Alerta: El campo id_Sala no es modificable, se estableció otro";
        }

        const nuevaSala = await Sala.create({
            id_Cine: data.id_Cine,
            nombre: data.nombre,
            capacidad: data.capacidad,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado la sala correctamente." + extra, sala: nuevaSala });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente una sala
const modifySalaById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Cine" in data) datosCambiar.id_Cine = data.id_Cine;
        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("capacidad" in data) datosCambiar.capacidad = data.capacidad;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Sala.update(datosCambiar, { where: { id_Sala: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Sala con el id: ${id} no encontrada` });
        }

        res.status(200).json({ message: "La sala ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar una sala
const deleteSalaById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Sala.destroy({ where: { id_Sala: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la sala, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la sala de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSalas,
    getSalaById,
    createSala,
    modifySalaById,
    deleteSalaById
};