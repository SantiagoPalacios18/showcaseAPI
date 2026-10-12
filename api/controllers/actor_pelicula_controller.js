const { Actor_Pelicula } = require('../models/index.js');

// GET: Obtener todas las relaciones Actor-Pelicula
const getActoresPeliculas = async (req, res) => {
    try {
        const registros = await Actor_Pelicula.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener relaciones por ID de Película
const getActoresByPeliculaId = async (req, res) => {
    try {
        const { id_Pelicula } = req.params;
        const registros = await Actor_Pelicula.findAll({
            where: { id_Pelicula }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron actores para la pelicula: ${id_Pelicula}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Vincular un actor a una película
const createActorPelicula = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Actor || !data.id_Pelicula || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Actor, id_Pelicula o DVH)"
            });
        }

        const existe = await Actor_Pelicula.findOne({
            where: {
                id_Actor: data.id_Actor,
                id_Pelicula: data.id_Pelicula
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La relación actor-película ya existe" });
        }

        const nuevoRegistro = await Actor_Pelicula.create({
            id_Actor: data.id_Actor,
            id_Pelicula: data.id_Pelicula,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Actor vinculado a la película correctamente.",
            actorPelicula: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente (DVH)
const modifyActorPelicula = async (req, res) => {
    try {
        const { id_Actor, id_Pelicula } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Actor_Pelicula.update(datosCambiar, {
            where: { id_Actor, id_Pelicula }
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

// DELETE: Desvincular un actor de una película
const deleteActorPelicula = async (req, res) => {
    try {
        const { id_Actor, id_Pelicula } = req.params;
        const eliminadas = await Actor_Pelicula.destroy({
            where: { id_Actor, id_Pelicula }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró la relación, 0 eliminaciones realizadas" });
        }

        res.status(200).json({
            message: `Actor ${id_Actor} desvinculado de la película ${id_Pelicula} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getActoresPeliculas,
    getActoresByPeliculaId,
    createActorPelicula,
    modifyActorPelicula,
    deleteActorPelicula
};