const crypto = require("crypto")
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const { Code, Usuario, Sesion } = require("../models/index.js")

// Genera un código numérico de 6 dígitos (crypto.randomInt es seguro, Math.random NO)
const generarCodigo = () => crypto.randomInt(0, 1000000).toString().padStart(6, "0")

// TODO: reemplazar por el envío real del mail (por ejemplo con nodemailer)
// Por ahora solo lo muestra en la consola del servidor para poder probar el flujo
const enviarCodigo = async (email, codigo) => {
    console.log(`[RECUPERACIÓN] Código para ${email}: ${codigo}`)
}

// Busca el usuario por email y verifica que tenga un código vigente y coincidente.
// Devuelve { user, registro } si es válido, o null si no.
const buscarCodigoValido = async (email, code) => {
    const user = await Usuario.findOne({ where: { email } })
    if (!user) return null

    const registro = await Code.findOne({
        where: {
            id_User: user.id_Usuario,
            code: String(code),
            expires_at: { [Op.gt]: new Date() } // solo códigos que todavía no vencieron
        }
    })
    if (!registro) return null

    return { user, registro }
}

// POST: Genera un código de recuperación y lo envía al email del usuario
const solicitarCodigo = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Falta ingresar datos" })
        }

        // Siempre se devuelve la misma respuesta exista o no el email,
        // así nadie puede usar este endpoint para averiguar qué emails están registrados
        const respuesta = { message: "Si el email está registrado, se envió un código de verificación" }

        const user = await Usuario.findOne({ where: { email } })
        if (!user) {
            return res.status(200).json(respuesta)
        }

        // id_User es unique: se borra el código anterior (si existe) antes de crear el nuevo
        await Code.destroy({ where: { id_User: user.id_Usuario } })

        const codigo = generarCodigo()
        await Code.create({
            id_User: user.id_Usuario,
            code: codigo
            // expires_at toma el defaultValue del modelo (30 minutos)
        })

        await enviarCodigo(user.email, codigo)

        res.status(200).json(respuesta)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

// POST: Verifica que el código sea correcto y no haya vencido (NO lo consume)
// Sirve para que el front pase del paso "ingresar código" al paso "nueva contraseña"
const verificarCodigo = async (req, res) => {
    try {
        const { email, code } = req.body

        if (!email || !code) {
            return res.status(400).json({ message: "Falta ingresar datos" })
        }

        const valido = await buscarCodigoValido(email, code)
        if (!valido) {
            return res.status(400).json({ message: "Código inválido o vencido" })
        }

        res.status(200).json({ message: "Código válido" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

// PATCH: Cambia la contraseña usando el código. El código se consume (se usa una sola vez)
const restablecerContraseña = async (req, res) => {
    try {
        const { email, code, contraseña } = req.body

        if (!email || !code || !contraseña) {
            return res.status(400).json({ message: "Falta ingresar datos" })
        }

        const valido = await buscarCodigoValido(email, code)
        if (!valido) {
            return res.status(400).json({ message: "Código inválido o vencido" })
        }

        const { user, registro } = valido

        user.contraseña = await bcrypt.hash(contraseña, 10)
        await user.save()

        // El código ya se usó: se elimina
        await registro.destroy()

        // Se cierran todas las sesiones abiertas (refresh tokens) del usuario por seguridad
        await Sesion.destroy({ where: { id_Usuario: user.id_Usuario } })

        res.status(200).json({ message: "Contraseña actualizada correctamente" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error del servidor" })
    }
}

// Limpieza: elimina los códigos vencidos. Se llama desde un cron en index.js
const limpiarCodigosVencidos = async () => {
    const borrados = await Code.destroy({
        where: { expires_at: { [Op.lt]: new Date() } }
    })
    console.log(`Códigos vencidos eliminados: ${borrados}`)
    return borrados
}

module.exports = {
    solicitarCodigo,
    verificarCodigo,
    restablecerContraseña,
    limpiarCodigosVencidos
}