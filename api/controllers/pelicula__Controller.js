const { Pelicula } = require('../models/index.js');
const path = require('path')
const fs = require('fs')

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
        if(!req.file){
            res.status(400).json({error: 'No se subio una imagen a cartelera'})
        }
        const poster = req.file;

        const oldPath = poster.path
        
        const nuevaPelicula = await Pelicula.create(req.body);

        const newName = `poster-movie-${nuevaPelicula.id_Pelicula}${path.extname(poster.originalname)}`
        console.log(newName)

        const newPath = path.join('./media/posters/', newName)

        fs.renameSync(oldPath, newPath)

        const baseUrl = `${req.protocol}://${req.get('host')}`
        const peliFinal = await nuevaPelicula.update({imagen: `${baseUrl}/posters/${newName}`})

        console.log(peliFinal)
        res.status(201).json(peliFinal);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

const modifyPeliculaById = async (req, res) => {
    try {
        const { id } = req.params;
        const datos = { ...req.body };
        delete datos.DVH;
        if (Object.keys(datos).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }
        const [updated] = await Pelicula.update(datos, { where: { id_pelicula: id } });
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