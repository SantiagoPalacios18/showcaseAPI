const { Patente_Rol, Rol, Patente } = require('../models/index.js');

// GET: Obtener todas las relaciones Patente-Rol
const getPatentesRoles = async (req, res) => {
    try {
        const registros = await Patente_Rol.findAll({
            include: [
                { model: Rol, attributes: ['id_Rol', 'nombre'] },
                { model: Patente, attributes: ['id_Patente', 'nombre'] }
            ]
        });
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener patentes asignadas a un rol específico
const getPatentesByRolId = async (req, res) => {
    try {
        const { id_Rol } = req.params;
        const registros = await Patente_Rol.findAll({
            where: { id_Rol },
            include: [{ model: Patente }]
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron patentes asignadas al rol: ${id_Rol}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Asignar patente a rol
const createPatenteRol = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Rol || !data.id_Patente || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Rol, id_Patente o DVH)"
            });
        }

        const existe = await Patente_Rol.findOne({
            where: {
                id_Rol: data.id_Rol,
                id_Patente: data.id_Patente
            }
        });

        if (existe) {
            return res.status(400).json({ message: "La patente ya está asignada a este rol" });
        }

        const nuevaRelacion = await Patente_Rol.create({
            id_Rol: data.id_Rol,
            id_Patente: data.id_Patente,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha asignado la patente al rol correctamente.",
            patenteRol: nuevaRelacion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente (DVH)
const modifyPatenteRol = async (req, res) => {
    try {
        const { id_Rol, id_Patente } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Patente_Rol.update(datosCambiar, {
            where: { id_Rol, id_Patente }
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

// DELETE: Quitar patente a rol
const deletePatenteRol = async (req, res) => {
    try {
        const { id_Rol, id_Patente } = req.params;
        const eliminadas = await Patente_Rol.destroy({
            where: { id_Rol, id_Patente }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró la asignación, 0 eliminaciones realizadas" });
        }

        res.status(200).json({
            message: `Se ha quitado la patente ${id_Patente} del rol ${id_Rol} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPatentesRoles,
    getPatentesByRolId,
    createPatenteRol,
    modifyPatenteRol,
    deletePatenteRol
};