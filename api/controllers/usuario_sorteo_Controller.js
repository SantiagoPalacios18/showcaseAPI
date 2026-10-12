const { Usuario_sorteo } = require('../models/index.js');

// GET: Obtener todos los participantes de sorteos
const getUsuariosSorteos = async (req, res) => {
    try {
        const registros = await Usuario_sorteo.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener participantes de un sorteo específico
const getUsuariosBySorteoId = async (req, res) => {
    try {
        const { id_sorteo } = req.params;
        const registros = await Usuario_sorteo.findAll({
            where: { id_sorteo }
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron participantes para el sorteo: ${id_sorteo}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Inscribir un usuario a un sorteo
const createUsuarioSorteo = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.id_sorteo || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, id_sorteo o DVH)"
            });
        }

        const existe = await Usuario_sorteo.findOne({
            where: {
                id_Usuario: data.id_Usuario,
                id_sorteo: data.id_sorteo
            }
        });

        if (existe) {
            return res.status(400).json({ message: "El usuario ya está registrado en este sorteo" });
        }

        const nuevaInscripcion = await Usuario_sorteo.create({
            id_Usuario: data.id_Usuario,
            id_sorteo: data.id_sorteo,
            fecha_inscripcion: data.fecha_inscripcion || new Date(),
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Usuario inscripto al sorteo correctamente.",
            usuarioSorteo: nuevaInscripcion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar registro de sorteo (DVH)
const modifyUsuarioSorteo = async (req, res) => {
    try {
        const { id_Usuario, id_sorteo } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("fecha_inscripcion" in data) datosCambiar.fecha_inscripcion = data.fecha_inscripcion;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Usuario_sorteo.update(datosCambiar, {
            where: { id_Usuario, id_sorteo }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Registro no encontrado para modificar" });
        }

        res.status(200).json({
            message: "Inscripción modificada correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Dar de baja usuario de un sorteo
const deleteUsuarioSorteo = async (req, res) => {
    try {
        const { id_Usuario, id_sorteo } = req.params;
        const eliminadas = await Usuario_sorteo.destroy({
            where: { id_Usuario, id_sorteo }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el registro" });
        }

        res.status(200).json({
            message: `Usuario ${id_Usuario} desvinculado del sorteo ${id_sorteo} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUsuariosSorteos,
    getUsuariosBySorteoId,
    createUsuarioSorteo,
    modifyUsuarioSorteo,
    deleteUsuarioSorteo
};