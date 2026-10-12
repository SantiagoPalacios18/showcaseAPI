const { Patente_Usuario, Usuario, Patente } = require('../models/index.js');

// GET: Obtener todas las relaciones Patente-Usuario
const getPatentesUsuarios = async (req, res) => {
    try {
        const registros = await Patente_Usuario.findAll({
            include: [
                { model: Usuario, attributes: ['id_Usuario', 'nombre', 'mail'] },
                { model: Patente, attributes: ['id_Patente', 'nombre'] }
            ]
        });
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener patentes asignadas a un usuario específico por id_Usuario
const getPatentesByUsuarioId = async (req, res) => {
    try {
        const { id_Usuario } = req.params;
        const registros = await Patente_Usuario.findAll({
            where: { id_Usuario },
            include: [{ model: Patente }]
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron patentes asignadas al usuario: ${id_Usuario}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Asignar una patente a un usuario
const createPatenteUsuario = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.id_Patente || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, id_Patente o DVH)"
            });
        }

        // Verificar si la relación ya existe
        const existe = await Patente_Usuario.findOne({
            where: {
                id_Usuario: data.id_Usuario,
                id_Patente: data.id_Patente
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La patente ya está asignada a este usuario" });
        }

        const nuevaRelacion = await Patente_Usuario.create({
            id_Usuario: data.id_Usuario,
            id_Patente: data.id_Patente,
            DVH: data.DVH
        });

        res.status(200).json({ 
            message: "Se ha asignado la patente al usuario correctamente.", 
            patenteUsuario: nuevaRelacion 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente el registro (ej. actualizar DVH)
const modifyPatenteUsuario = async (req, res) => {
    try {
        const { id_Usuario, id_Patente } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Patente_Usuario.update(datosCambiar, {
            where: { id_Usuario, id_Patente }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Registro no encontrado para modificar" });
        }

        res.status(200).json({ 
            message: "El registro ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Quitar una patente a un usuario
const deletePatenteUsuario = async (req, res) => {
    try {
        const { id_Usuario, id_Patente } = req.params;
        const eliminadas = await Patente_Usuario.destroy({
            where: { id_Usuario, id_Patente }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró la asignación, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ 
            message: `Se ha quitado la patente ${id_Patente} del usuario ${id_Usuario} correctamente.` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPatentesUsuarios,
    getPatentesByUsuarioId,
    createPatenteUsuario,
    modifyPatenteUsuario,
    deletePatenteUsuario
};