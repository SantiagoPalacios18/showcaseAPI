const jwt = require("jsonwebtoken")

const {Usuario, Rol, Patente} = require("../models/index.js")


const SECRET_KEY = "nomemiress"

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "No se encontró el token" })
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY)
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
}


const checkPatent = (patenteNecesaria) => {
    return async (req, res, next) => {
        try{
            const usuario = await Usuario.findByPk(req.user.id_Usuario, {
                include: [
                    { model: Rol, include: [Patente] },
                    { model: Patente } // solo si también usás patente_usuario
                ]
            });
            // console.log("Usuario encontrado en checkPatent:", usuario.toJSON())
            const patentesDeRol = usuario.Rol?.Patentes?.map(p => p.nombre) ?? []
            const patentesSueltas = usuario.Patentes?.map(p => p.nombre) ?? []
            const patentes = [...patentesDeRol, ...patentesSueltas]
            if (!patentes.includes(patenteNecesaria)) { // Si las patentes del usuario NO incluyen las necesarias para el endpoint... no se le permite el acceso
                return res.status(403).json({ message: "No tiene permisos para acceder." })
            }
            next()

        }catch(error){
            console.log(error)
            return res.status(401).json({ message: "No autorizado" });
        }
    }
};



module.exports = { SECRET_KEY, authMiddleware, checkPatent };