const { Tecnologia } = require('../models/index.js');

// GET: Obtener todas las tecnologias
const getTecnologias = async (req, res) => {
    try {
        const tecnologias = await Tecnologia.findAll();
        res.status(200).json(tecnologias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener una tecnologia por ID
const getTecnologiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tecnologia = await Tecnologia.findByPk(id);

        if (!tecnologia) {
            return res.status(404).json({ message: `Tecnologia con el id: ${id} no encontrada` });
        }

        res.status(200).json(tecnologia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear una nueva tecnologia
const createTecnologia = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre o DVH)"
            });
        }

        let extra = "";
        if ("id_tecnologia" in data) {
            extra = " Alerta: El campo id_tecnologia no es modificable, se estableció otro";
        }

        const nuevaTecnologia = await Tecnologia.create({
            nombre: data.nombre,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado la tecnologia correctamente." + extra, tecnologia: nuevaTecnologia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente una tecnologia
const modifyTecnologiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Tecnologia.update(datosCambiar, { where: { id_tecnologia: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Tecnologia con el id: ${id} no encontrada` });
        }

        res.status(200).json({ message: "La tecnologia ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar una tecnologia
const deleteTecnologiaById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Tecnologia.destroy({ where: { id_tecnologia: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la tecnologia, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la tecnologia de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getTecnologias,
    getTecnologiaById,
    createTecnologia,
    modifyTecnologiaById,
    deleteTecnologiaById
};