const { Proyeccion_pelicula } = require('../models/index.js');

// GET: Obtener todas las relaciones Proyeccion-Pelicula
const getProyeccionesPeliculas = async (req, res) => {
    try {
        const registros = await Proyeccion_pelicula.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener proyecciones por película
const getProyeccionesByPeliculaId = async (req, res) => {
    try {
        const { id_pelicula } = req.params;
        const registros = await Proyeccion_pelicula.findAll({
            where: { id_pelicula }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron proyecciones para la película: ${id_pelicula}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Asignar proyección a película
const createProyeccionPelicula = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_pelicula || !data.id_proyeccion || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_pelicula, id_proyeccion o DVH)"
            });
        }

        const existe = await Proyeccion_pelicula.findOne({
            where: {
                id_pelicula: data.id_pelicula,
                id_proyeccion: data.id_proyeccion
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La relación ya existe" });
        }

        const nuevoRegistro = await Proyeccion_pelicula.create({
            id_pelicula: data.id_pelicula,
            id_proyeccion: data.id_proyeccion,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Proyección asignada a la película correctamente.",
            proyeccionPelicula: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar (DVH)
const modifyProyeccionPelicula = async (req, res) => {
    try {
        const { id_pelicula, id_proyeccion } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Proyeccion_pelicula.update(datosCambiar, {
            where: { id_pelicula, id_proyeccion }
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

// DELETE: Quitar proyección de película
const deleteProyeccionPelicula = async (req, res) => {
    try {
        const { id_pelicula, id_proyeccion } = req.params;
        const eliminadas = await Proyeccion_pelicula.destroy({
            where: { id_pelicula, id_proyeccion }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el registro a eliminar" });
        }

        res.status(200).json({
            message: `Proyección ${id_proyeccion} quitada de la película ${id_pelicula} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProyeccionesPeliculas,
    getProyeccionesByPeliculaId,
    createProyeccionPelicula,
    modifyProyeccionPelicula,
    deleteProyeccionPelicula
};