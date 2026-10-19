const { Usuario } = require('../models/index.js');
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")

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
                exclude: ["contraseña", "foto"]
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
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `user con el id: ${id} no encontrado` });
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        await user.update(datosCambiar);


        res.status(200).json({ message: "El user ha sido modificado correctamente" });
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

const createTestUser = async (req, res) => {
    try {

        
        const existentes = await Usuario.findAll({
            where: { email: { [Op.like]: "test%@a.com" } },
            attributes: ["email"]
        });
        if (existentes.length >= 20) {
            return res.status(400).json({ message: "Se hizo el máximo posible de usuarios test" });
        }
        const numeros = existentes.map(u => {
            const n = Number(u.email.match(/^test(\d+)@a\.com$/)?.[1]);
            return Number.isNaN(n) ? 0 : n;
        });
        const num = numeros.length ? Math.max(...numeros) + 1 : 1;

        const usuario = await Usuario.create({
            nombre: "Test",
            apellido: "User",
            DNI: "0000" + String(num),
            telefono: "0000" + String(num),
            email: `test${num}@a.com`,
            contraseña: await bcrypt.hash("123", 10)
        });

        res.status(200).json({ message: "Usuario test creado correctamente, contraseña: 123", user: usuario });
    } catch (error) {
    console.error(error.errors || error);
    res.status(500).json({
        error: error.message,
        detalles: error.errors?.map(e => ({ campo: e.path, mensaje: e.message }))
    });
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    modifyuserById,
    deleteuserById,
    createTestUser
}

