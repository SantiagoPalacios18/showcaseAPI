const { Sesion } = require('../models/index.js');

// GET: Obtener todas las sesiones
const getSesiones = async (req, res) => {
    try {
        const sesiones = await Sesion.findAll();
        res.status(200).json(sesiones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener sesión por ID
const getSesionById = async (req, res) => {
    try {
        const { id } = req.params;
        const sesion = await Sesion.findByPk(id);

        if (!sesion) {
            return res.status(404).json({ message: `Sesion con el id: ${id} no encontrada` });
        }

        res.status(200).json(sesion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear sesión
const createSesion = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.token || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, token o DVH)"
            });
        }

        let extra = "";
        if ("id_sesion" in data || "id_Sesion" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevaSesion = await Sesion.create({
            id_Usuario: data.id_Usuario,
            token: data.token,
            fecha_inicio: data.fecha_inicio || new Date(),
            fecha_expiracion: data.fecha_expiracion || null,
            activa: data.activa !== undefined ? data.activa : 1,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Sesión creada correctamente." + extra,
            sesion: nuevaSesion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar sesión
const modifySesionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("token" in data) datosCambiar.token = data.token;
        if ("fecha_expiracion" in data) datosCambiar.fecha_expiracion = data.fecha_expiracion;
        if ("activa" in data) datosCambiar.activa = data.activa;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Sesion.update(datosCambiar, {
            where: { id_sesion: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Sesion con el id: ${id} no encontrada` });
        }

        res.status(200).json({
            message: "La sesión ha sido modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar sesión
const deleteSesionById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Sesion.destroy({ where: { id_sesion: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado la sesión, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la sesión de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSesiones,
    getSesionById,
    createSesion,
    modifySesionById,
    deleteSesionById
};