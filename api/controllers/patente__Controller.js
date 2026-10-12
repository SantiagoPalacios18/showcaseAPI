const { Patente } = require('../models/index.js');

// GET: Obtener todas las patentes
const getPatentes = async (req, res) => {
    try {
        const patentes = await Patente.findAll();
        res.status(200).json(patentes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener una patente por ID
const getPatenteById = async (req, res) => {
    try {
        const { id } = req.params;
        const patente = await Patente.findByPk(id);

        if (!patente) {
            return res.status(404).json({ message: `Patente con el id: ${id} no encontrada` });
        }

        res.status(200).json(patente);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear una nueva patente
const createPatente = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre o DVH)"
            });
        }

        let extra = "";
        if ("id_Patente" in data) {
            extra = " Alerta: El campo id_Patente no es modificable, se estableció otro";
        }

        const nuevaPatente = await Patente.create({
            nombre: data.nombre,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado la patente correctamente." + extra, patente: nuevaPatente });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente una patente
const modifyPatenteById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Patente.update(datosCambiar, { where: { id_Patente: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Patente con el id: ${id} no encontrada` });
        }

        res.status(200).json({ message: "La patente ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar una patente
const deletePatenteById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Patente.destroy({ where: { id_Patente: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la patente, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la patente de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPatentes,
    getPatenteById,
    createPatente,
    modifyPatenteById,
    deletePatenteById
};