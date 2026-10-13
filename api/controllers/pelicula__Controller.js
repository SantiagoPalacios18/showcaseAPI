const { Pelicula } = require('../models/index.js');

const getPeliculas = async (req, res) => {
    try {
        const peliculas = await Pelicula.findAll();
        res.status(200).json(peliculas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) return res.status(404).json({ message: "Película no encontrada" });
        res.status(200).json(pelicula);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPelicula = async (req, res) => {
    try {
        const nuevaPelicula = await Pelicula.create(req.body);
        res.status(201).json(nuevaPelicula);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const modifyPeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Pelicula.update(req.body, { where: { id_pelicula: id } });
        if (!updated) return res.status(404).json({ message: "Película no encontrada" });
        res.status(200).json({ message: "Película actualizada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Pelicula.destroy({ where: { id_pelicula: id } });
        if (!deleted) return res.status(404).json({ message: "Película no encontrada" });
        res.status(200).json({ message: "Película eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPeliculas,
    getPeliculaById,
    createPelicula,
    modifyPeliculaById,
    deletePeliculaById
};