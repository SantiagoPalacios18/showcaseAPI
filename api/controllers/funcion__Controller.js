const { Funcion } = require('../models/index.js');

// GET: Obtener todas las funciones
const getFunciones = async (req, res) => {
    try {
        const funciones = await Funcion.findAll();
        res.status(200).json(funciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET: Obtener una función por ID
const getFuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcion = await Funcion.findByPk(id);

        if (!funcion) {
            return res.status(404).json({ message: `Función con el id: ${id} no encontrada` });
        }

        res.status(200).json(funcion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST: Crear una nueva función
const createFuncion = async (req, res) => {
    try {
        const data = req.body;

        const nuevaFuncion = await Funcion.create({
            id_sala: data.id_sala,
            id_pelicula: data.id_pelicula,
            id_tecnologia: data.id_tecnologia,
            idioma: data.idioma,
            proyeccion: data.proyeccion,
            horarioInicio: data.horarioInicio,
            DVH: data.DVH
        });

        res.status(201).json({ message: "Se ha creado la función correctamente.", funcion: nuevaFuncion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PATCH: Modificar parcialmente una función en base a su ID
const modifyFuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_sala" in data) datosCambiar.id_sala = data.id_sala;
        if ("id_pelicula" in data) datosCambiar.id_pelicula = data.id_pelicula;
        if ("id_tecnologia" in data) datosCambiar.id_tecnologia = data.id_tecnologia;
        if ("idioma" in data) datosCambiar.idioma = data.idioma;
        if ("proyeccion" in data) datosCambiar.proyeccion = data.proyeccion;
        if ("horarioInicio" in data) datosCambiar.horarioInicio = data.horarioInicio;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        // Usamos id_Funcion con F mayúscula tal como está en el modelo
        const [filasModificadas] = await Funcion.update(datosCambiar, { where: { id_Funcion: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Función con el id: ${id} no encontrada` });
        }

        res.status(200).json({ message: "La función ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE: Eliminar el registro de una función en base a su ID
const deletefuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionesEliminadas = await Funcion.destroy({ where: { id_Funcion: id } });

        if (funcionesEliminadas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la función, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la función de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getFunciones,
    getFuncionById,
    createFuncion,
    modifyFuncionById,
    deletefuncionById,
}