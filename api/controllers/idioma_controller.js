const { Idioma } = require('../models/index.js');

// GET: Obtener todos los idiomas
const getIdiomas = async (req, res) => {
    try {
        const idiomas = await Idioma.findAll();
        res.status(200).json(idiomas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener un idioma por ID
const getIdiomaById = async (req, res) => {
    try {
        const { id } = req.params;
        const idioma = await Idioma.findByPk(id);

        if (!idioma) {
            return res.status(404).json({ message: `Idioma con el id: ${id} no encontrado` });
        }

        res.status(200).json(idioma);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear un nuevo idioma
const createIdioma = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre o DVH)"
            });
        }

        let extra = "";
        if ("id_idioma" in data) {
            extra = " Alerta: El campo id_idioma no es modificable, se estableció otro";
        }

        const nuevoIdioma = await Idioma.create({
            nombre: data.nombre,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el idioma correctamente." + extra, idioma: nuevoIdioma });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente un idioma
const modifyIdiomaById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Idioma.update(datosCambiar, { where: { id_idioma: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Idioma con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El idioma ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar un idioma
const deleteIdiomaById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Idioma.destroy({ where: { id_idioma: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el idioma, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el idioma de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getIdiomas,
    getIdiomaById,
    createIdioma,
    modifyIdiomaById,
    deleteIdiomaById
};