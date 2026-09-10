// Se van a agrupar todas las rutas en este archivo, se van a poner en un route que agrupe todas y en el index principal se importa solo el route grande

const express = require("express")
const router = express.Router();



// Rutas
const authRoutes = require("./authentication__Routes.js");
const adminRoutes = require("./administradorBD__Routes.js")
const usuarioRoutes = require("./usuario__Routes.js")

// Aplicadas al server
router.use(authRoutes);
router.use('/admin', adminRoutes)
router.use('/users', usuarioRoutes)

module.exports = router;

