const { Actor } = require('../models/index.js');

// GET: Obtener todos los actores
const getActores = async (req, res) => {
    try {
        const actores = await Actor.findAll();
        res.status(200).json(actores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener un actor por ID
const getActorById = async (req, res) => {
    try {
        const { id } = req.params;
        const actor = await Actor.findByPk(id);

        if (!actor) {
            return res.status(404).json({ message: `Actor con el id: ${id} no encontrado` });
        }

        res.status(200).json(actor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear un nuevo actor
const createActor = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.apellido || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, apellido o DVH)"
            });
        }

        let extra = "";
        if ("id_Actor" in data) {
            extra = " Alerta: El campo id_Actor no es modificable, se estableció otro";
        }

        const nuevoActor = await Actor.create({
            nombre: data.nombre,
            apellido: data.apellido,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el actor correctamente." + extra, actor: nuevoActor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente un actor por ID
const modifyActorById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("apellido" in data) datosCambiar.apellido = data.apellido;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Actor.update(datosCambiar, { where: { id_Actor: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Actor con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El actor ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar un actor por ID
const deleteActorById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Actor.destroy({ where: { id_Actor: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el actor, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el actor de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getActores,
    getActorById,
    createActor,
    modifyActorById,
    deleteActorById
};