const { Usuario } = require('../models/index.js');



// Obtener todos los useres
const getUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Usuario.findByPk(id, {
            attributes:{
                exclude: ["contraseña"]
            }
        });

        if (!user) {
            return res.status(404).json({ message: `usuario con el id: ${id} no encontrado` });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
/*
// Crear un nuevo usuario
const createUser = async (req, res) => {
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

        const nuevouser = await userBD.create({
            id_Rol: data.id_Rol,
            nombre: data.nombre,
            apellido: data.apellido,
            DNI: data.DNI,
            telefono: data.telefono,
            email: data.email,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el user correctamente." + extra, user: nuevouser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Modificar parcialmente un user en base a su ID
const modifyuserById = async (req, res) => {
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

        const [filasModificadas] = await userBD.update(datosCambiar, { where: { id_Administador: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `user con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El user ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar el registro de un user en base a su ID
const deleteuserById = async (req, res) => {
    try {
        const { id } = req.params;
        const useresEliminados = await userBD.destroy({ where: { id_Usuario: id } });

        if (useresEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado el usuario, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el user de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
*/
module.exports = {
    getUsers,
    getUserById,
    //createUser,
    //modifyuserById,
    //deleteuserById,
}

