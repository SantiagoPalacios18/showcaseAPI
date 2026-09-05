const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {Usuario} = require("../models/usuario__Model")
const {Sesion} = require("../models/sesion__Model")
const { authMiddleware, SECRET_KEY } = require("../middlewares/auth__Middleware")



const login = async (req, res) => {
    try {
        const { email, contraseña } = req.body

        if (!email || !contraseña) {
            return res.status(400).json({ message: "Falta ingresar datos" })
        }

        const user = await Usuario.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: "Datos invalidos: EMAIL" })
        }
        console.log("Usuario encontrado:", user.toJSON()) // Muestra el usuario encontrado en la consola
        const validPassword = await bcrypt.compare(contraseña, user.contraseña)
        if (!validPassword) {
            return res.status(401).json({ message: "Datos invalidos: CONTRASEÑA" })
        }

        const accessToken = jwt.sign(
            { id: user.id_Usuario, username: user.username }, // Payload
            SECRET_KEY, // Clave secreta para firmar el token
            { expiresIn: "1h" } // Expiración (jwt calcula la fecha automaticamente)
        )

        const refreshToken = jwt.sign(
            { id: user.id_Usuario },
            SECRET_KEY,
            { expiresIn: "7d" }
        )

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        await Sesion.create({
            id_Usuario: user.id_Usuario,
            token: refreshToken,
            expires_at: expiresAt
        })

        res.status(200).json({
            message: "Login exitoso",
            accessToken,
            refreshToken,
            user: user.toJSON()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

const register = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            email,
            contraseña,
            confirmarContraseña
        } = req.body

        if (!nombre || !apellido || !email || !contraseña || !confirmarContraseña) {
            return res.status(400).json({ message: "Falta ingresar datos" })
        }

        const existingUser = await Usuario.findOne({ where: { email } })
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está en uso" })
        }

        if (contraseña !== confirmarContraseña) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" })
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10)

        const user = await Usuario.create({
            nombre,
            apellido,
            email,
            contraseña: hashedPassword
        })

        res.status(200).json({ message: "USUARIO REGISTRADO CON ÉXITO", user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

// GET /me: Devuelve la información del usuario basado en el token del localStorage (SE USA MIDDLEWARE, fijarse authetication__Routes.js)
// Esto se hace porque cuando se recarga la pagina, se pierde al estado del usuario
const me = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.user.id, {
            attributes: { exclude: ["password"] }
        })

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.status(200).json(user)
        console.log("Usuario encontrado EN /ME:", user.toJSON()) // Muestra el usuario encontrado en la consola
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

module.exports = {
    login,
    register,
    me
};