
const { AdministradorBD } = require('../models/index.js');

// Obtener todos los administradores
const getAdministradores = async (req, res) => {
    try {
        const administradores = await AdministradorBD.findAll();
        res.status(200).json(administradores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener un administrador por ID
const getAdministradorById = async (req, res) => {
    try {
        const { id } = req.params;
        const administrador = await AdministradorBD.findByPk(id);

        if (!administrador) {
            return res.status(404).json({ message: `Administrador con el id: ${id} no encontrado` });
        }

        res.status(200).json(administrador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear un nuevo administrador
const createAdministrador = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Rol || !data.nombre || !data.apellido || !data.DNI || !data.telefono || !data.email || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Rol, nombre, apellido, DNI, telefono, email o DVH)"
            });
        }

        let extra = "";
        if ("id_Administador" in data) {
            extra = " Alerta: El campo id_Administador no es modificable, se estableció otro";
        }

        const nuevoAdministrador = await AdministradorBD.create({
            id_Rol: data.id_Rol,
            nombre: data.nombre,
            apellido: data.apellido,
            DNI: data.DNI,
            telefono: data.telefono,
            email: data.email,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el administrador correctamente." + extra, administrador: nuevoAdministrador });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Modificar parcialmente un administrador en base a su ID
const modifyAdministradorById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Rol" in data) {
            datosCambiar.id_Rol = data.id_Rol;
        }
        if ("nombre" in data) {
            datosCambiar.nombre = data.nombre;
        }
        if ("apellido" in data) {
            datosCambiar.apellido = data.apellido;
        }
        if ("DNI" in data) {
            datosCambiar.DNI = data.DNI;
        }
        if ("telefono" in data) {
            datosCambiar.telefono = data.telefono;
        }
        if ("email" in data) {
            datosCambiar.email = data.email;
        }
        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await AdministradorBD.update(datosCambiar, { where: { id_Administador: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Administrador con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El administrador ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar el registro de un administrador en base a su ID
const deleteAdministradorById = async (req, res) => {
    try {
        const { id } = req.params;
        const administradoresEliminados = await AdministradorBD.destroy({ where: { id_Administador: id } });

        if (administradoresEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado el administrador, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el administrador de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAdministradores,
    getAdministradorById,
    createAdministrador,
    modifyAdministradorById,
    deleteAdministradorById,
}

