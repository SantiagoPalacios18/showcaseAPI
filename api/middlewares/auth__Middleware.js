const jwt = require("jsonwebtoken")

const SECRET_KEY = "nomemiress"

const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]

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



module.exports = { SECRET_KEY, authMiddleware };