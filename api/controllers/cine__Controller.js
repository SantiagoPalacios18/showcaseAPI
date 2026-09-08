const { Cine } = require('../models/index.js');

// GET: Obtener todos los cines
const getCines = async (req, res) => {
    try {
        const cines = await Cine.findAll();
        res.status(200).json(cines);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET: Obtener un cine por ID
const getCineById = async (req, res) => {
    try {
        const { id } = req.params;
        const cine = await Cine.findByPk(id);

        if (!cine) {
            return res.status(404).json({ message: `Cine con el id: ${id} no encontrado` });
        }

        res.status(200).json(cine);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST: Crear un nuevo cine
const createCine = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.ubicacion || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, ubicacion o DVH)"
            });
        }

        let extra = "";
        if ("id_Cine" in data) {
            extra = " Alerta: El campo id_Cine no es modificable, se estableció otro";
        }

        const nuevoCine = await Cine.create({
            nombre: data.nombre,
            ubicacion: data.ubicacion,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el cine correctamente." + extra, cine: nuevoCine });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PATCH: Modificar parcialmente un cine en base a su ID
const modifyCineById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) {
            datosCambiar.nombre = data.nombre;
        }
        if ("ubicacion" in data) {
            datosCambiar.ubicacion = data.ubicacion;
        }
        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Cine.update(datosCambiar, { where: { id_Cine: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Cine con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El cine ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE: Eliminar el registro de un cine en base a su ID
const deleteCineById = async (req, res) => {
    try {
        const { id } = req.params;
        const cinesEliminados = await Cine.destroy({ where: { id_Cine: id } });

        if (cinesEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado el cine, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el cine de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    getCines,
    getCineById,
    createCine,
    modifyCineById,
    deleteCineById,
}