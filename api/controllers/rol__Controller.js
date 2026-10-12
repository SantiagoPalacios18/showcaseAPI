const { Rol } = require('../models/index.js');

// GET: Obtener todos los roles
const getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener un rol por ID
const getRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await Rol.findByPk(id);

        if (!rol) {
            return res.status(404).json({ message: `Rol con el id: ${id} no encontrado` });
        }

        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear un nuevo rol
const createRol = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre o DVH)"
            });
        }

        let extra = "";
        if ("id_Rol" in data) {
            extra = " Alerta: El campo id_Rol no es modificable, se estableció otro";
        }

        const nuevoRol = await Rol.create({
            nombre: data.nombre,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el rol correctamente." + extra, rol: nuevoRol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente un rol
const modifyRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Rol.update(datosCambiar, { where: { id_Rol: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Rol con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El rol ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar un rol
const deleteRolById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Rol.destroy({ where: { id_Rol: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el rol, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el rol de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getRoles,
    getRolById,
    createRol,
    modifyRolById,
    deleteRolById
};