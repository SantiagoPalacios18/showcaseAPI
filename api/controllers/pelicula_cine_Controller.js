const { Pelicula_cine } = require('../models/index.js');

// GET: Obtener todas las relaciones Pelicula-Cine
const getPeliculasCines = async (req, res) => {
    try {
        const registros = await Pelicula_cine.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener películas de un cine específico
const getPeliculasByCineId = async (req, res) => {
    try {
        const { id_cine } = req.params;
        const registros = await Pelicula_cine.findAll({
            where: { id_cine }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron películas para el cine: ${id_cine}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Asignar película a cine
const createPeliculaCine = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_pelicula || !data.id_cine || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_pelicula, id_cine o DVH)"
            });
        }

        const existe = await Pelicula_cine.findOne({
            where: {
                id_pelicula: data.id_pelicula,
                id_cine: data.id_cine
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La relación ya existe" });
        }

        const nuevoRegistro = await Pelicula_cine.create({
            id_pelicula: data.id_pelicula,
            id_cine: data.id_cine,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Película asignada al cine correctamente.",
            peliculaCine: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar (DVH)
const modifyPeliculaCine = async (req, res) => {
    try {
        const { id_pelicula, id_cine } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Pelicula_cine.update(datosCambiar, {
            where: { id_pelicula, id_cine }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Registro no encontrado para modificar" });
        }

        res.status(200).json({
            message: "Registro modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Quitar película de un cine
const deletePeliculaCine = async (req, res) => {
    try {
        const { id_pelicula, id_cine } = req.params;
        const eliminadas = await Pelicula_cine.destroy({
            where: { id_pelicula, id_cine }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el registro" });
        }

        res.status(200).json({
            message: `Película ${id_pelicula} quitada del cine ${id_cine} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPeliculaCineByPk = async (req, res) => {
    try {
        const { id_cine, id_pelicula } = req.params;
        const registro = await Pelicula_cine.findOne({ where: { id_cine, id_pelicula } });
        if (!registro) {
            return res.status(404).json({ message: "Relación no encontrada" });
        }
        res.status(200).json(registro);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPeliculasCines,
    getPeliculasByCineId,
    getPeliculaCineByPk,
    createPeliculaCine,
    modifyPeliculaCine,
    deletePeliculaCine
};