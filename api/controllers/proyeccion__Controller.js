const { Proyeccion } = require('../models/index.js');

// GET: Obtener todas las proyecciones
const getProyecciones = async (req, res) => {
    try {
        const proyecciones = await Proyeccion.findAll();
        res.status(200).json(proyecciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener proyeccion por ID
const getProyeccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const proyeccion = await Proyeccion.findByPk(id);

        if (!proyeccion) {
            return res.status(404).json({ message: `Proyeccion con el id: ${id} no encontrada` });
        }

        res.status(200).json(proyeccion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear proyeccion
const createProyeccion = async (req, res) => {
    try {
        const data = req.body;

        if (!data.tipo || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (tipo o DVH)"
            });
        }

        let extra = "";
        if ("id_proyeccion" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevaProyeccion = await Proyeccion.create({
            tipo: data.tipo,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha creado la proyección correctamente." + extra,
            proyeccion: nuevaProyeccion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar proyeccion
const modifyProyeccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("tipo" in data) datosCambiar.tipo = data.tipo;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Proyeccion.update(datosCambiar, {
            where: { id_proyeccion: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Proyeccion con el id: ${id} no encontrada` });
        }

        res.status(200).json({
            message: "La proyeccion ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar proyeccion
const deleteProyeccionById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Proyeccion.destroy({ where: { id_proyeccion: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la proyeccion, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la proyeccion de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProyecciones,
    getProyeccionById,
    createProyeccion,
    modifyProyeccionById,
    deleteProyeccionById
};