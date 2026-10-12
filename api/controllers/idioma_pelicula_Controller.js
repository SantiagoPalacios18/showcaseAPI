const { Idioma_pelicula } = require('../models/index.js');

// GET: Obtener todas las relaciones Idioma-Pelicula
const getIdiomasPeliculas = async (req, res) => {
    try {
        const registros = await Idioma_pelicula.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener idiomas de una película específica
const getIdiomasByPeliculaId = async (req, res) => {
    try {
        const { id_pelicula } = req.params;
        const registros = await Idioma_pelicula.findAll({
            where: { id_pelicula }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron idiomas para la pelicula: ${id_pelicula}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Asignar un idioma a una película
const createIdiomaPelicula = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_pelicula || !data.id_idioma || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_pelicula, id_idioma o DVH)"
            });
        }

        const existe = await Idioma_pelicula.findOne({
            where: {
                id_pelicula: data.id_pelicula,
                id_idioma: data.id_idioma
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La relación ya existe" });
        }

        const nuevoRegistro = await Idioma_pelicula.create({
            id_pelicula: data.id_pelicula,
            id_idioma: data.id_idioma,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Idioma asignado a la película correctamente.",
            idiomaPelicula: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente (DVH)
const modifyIdiomaPelicula = async (req, res) => {
    try {
        const { id_pelicula, id_idioma } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Idioma_pelicula.update(datosCambiar, {
            where: { id_pelicula, id_idioma }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Relación no encontrada para modificar" });
        }

        res.status(200).json({
            message: "Relación modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Quitar idioma a una película
const deleteIdiomaPelicula = async (req, res) => {
    try {
        const { id_pelicula, id_idioma } = req.params;
        const eliminadas = await Idioma_pelicula.destroy({
            where: { id_pelicula, id_idioma }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró la asignación" });
        }

        res.status(200).json({
            message: `Idioma ${id_idioma} quitado de la película ${id_pelicula} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getIdiomasPeliculas,
    getIdiomasByPeliculaId,
    createIdiomaPelicula,
    modifyIdiomaPelicula,
    deleteIdiomaPelicula
};