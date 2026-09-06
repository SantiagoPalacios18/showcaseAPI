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
            return res.status(400).json({ message: "Datos invalidos: EMAIL" })
        }
        // console.log("Usuario encontrado:", user.toJSON())
        const validPassword = await bcrypt.compare(contraseña, user.contraseña)
        if (!validPassword) {
            return res.status(400).json({ message: "Datos invalidos: CONTRASEÑA" })
        }

        const accessToken = jwt.sign(
            { id_Usuario: user.id_Usuario }, // Payload
            SECRET_KEY, // Clave secreta para firmar el token
            { expiresIn: "1h" } // Expiración (jwt calcula la fecha automaticamente)
        )

        const refreshToken = jwt.sign(
            { id_Usuario: user.id_Usuario },
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


        // Seteás la cookie httpOnly
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // JavaScript no puede leerla
            secure: false, // en local false, en producción true (HTTPS)
            sameSite: "lax", // en local suele funcionar. Si da problemas probá "none"
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 días
        })

        res.status(200).json({
            message: "Login exitoso",
            accessToken,
            // refreshToken,
            user: user.toJSON()
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

  // Funcione que se va a usar en un boton de cerrar sesión, limpia el token (tanto de las cookies como de la BDs) y el usuario
  const logout = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken

      if (refreshToken) {
        await Sesion.destroy({ where: { token: refreshToken } })
      }

      res.clearCookie("refreshToken", {
        path: "/", 
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      })
      // AGREGAR SI NO ANDA: SACAR EL ACCESS EN EL LOCALSTORAGE
      res.status(200).json({ message: "Sesión cerrada" })
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
        const user = await Usuario.findByPk(req.user.id_Usuario, {
            attributes: { exclude: ["contraseña"] }
        })

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        res.status(200).json(user)
        // console.log("Usuario encontrado EN /ME:", user.toJSON()) // Muestra el usuario encontrado en la consola
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({ message: "No se encontró el token de refresco" })
        }
        let decoded
        try{
            decoded = jwt.verify(refreshToken, SECRET_KEY) // El verify verifica 1. Si el token está firmado con la SECRET_KEY, 2. Si el token ya expiró (y 3ro, devuelve el token desencriptado)
        } catch(error){
            return res.status(401).json({ message: "Refresh token inválido o expirado" })
        }
        
        const sesion = await Sesion.findOne({ where: { token: refreshToken } })
        if (!sesion ) { // No verificamos la caducidad dentro de la BDs porque el verify() de arriba ya lo hace, es redundante
                // Ahora te puede surgir la pregunta ¿Entonces para qué mierda guardamos el expires_at en la BDs si eso ya está metido en el token y el verify() lo revisa?
                // Para mejor administración dentro de la base. Su existencia no es reemplazar la verificación del verify(), sino para tener mayor accesibilidad a la fecha dentro de la BDs
                // Tambien es útil para hacer limpiadas manuales: "DELETE FROM sesiones WHERE expires_at < NOW()" sin tener que desencriptar el token
            return res.status(401).json({ message: "Refresh token inválido o expirado" })
        }
        const user = await Usuario.findByPk(decoded.id_Usuario) // 
        if (!user) {
        return res.status(500).json({ message: "Usuario no encontrado" })
        }

        const accessToken = jwt.sign(
            { id_Usuario: user.id_Usuario }, // Payload
            SECRET_KEY, // Clave secreta para firmar el token
            { expiresIn: "1h" } // Expiración (jwt calcula la fecha automaticamente)
        )
        res.status(200).json({ accessToken })

    }catch(error){
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }

}

module.exports = {
    login,
    register,
    me,
    refresh,
    logout,
};