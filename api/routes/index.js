const express = require('express');
const router = express.Router();

// Rutas
const authRoutes = require("./authentication__Routes.js");
const adminRoutes = require("./administradorBD__Routes.js")
const usuarioRoutes = require("./usuario__Routes.js");

const {authMiddleware} = require("../middlewares/auth__Middleware.js")

// Aplicadas al server
router.use(authRoutes);

router.use(authMiddleware) // en cada endpoint (de los routes de abajo) se va a usar el middleware auth, que busca el token y guarda el usuario en req.user (necesario para el middleware checkPatent)


router.use('/admin', adminRoutes)
router.use('/usuarios', usuarioRoutes)

// Entidades principales
router.use('/actores', require('./actor__Routes.js'));
router.use('/asientos', require('./asiento__Routes.js'));
router.use('/cines', require('./cine__routes.js'));
router.use('/compras-candy', require('./compraCandy__Routes.js'));
router.use('/compras-eventos', require('./compraEvento__Routes.js'));
router.use('/compras-tickets', require('./compraTicket_Routes.js'));
router.use('/funciones', require('./Funcion__Routes.js'));
router.use('/idiomas', require('./idioma__Routes.js'));
router.use('/operadores-candy', require('./operadorCandy__Routes.js'));
router.use('/patentes', require('./patente__Routes.js'));
router.use('/peliculas', require('./pelicula__Routes.js'));
router.use('/productos-candy', require('./productoCandy__Routes.js'));
router.use('/proyecciones', require('./proyeccion__Routes.js'));
router.use('/roles', require('./rol__Routes.js'));
router.use('/salas', require('./sala__Routes.js'));
router.use('/sesiones', require('./Sesion__Routes.js'));
router.use('/soporte-tecnico', require('./soporteTecnico__Routes.js'));
router.use('/sorteos', require('./sorteo__Routes.js'));
router.use('/tecnologias', require('./tecnologia__Routes.js'));



// Rutas intermedias (M:N)
router.use('/actores-peliculas', require('./actor_pelicula_Routes.js'));
router.use('/clientes-sorteos', require('./cliente_sorteo_Routes.js'));
router.use('/idiomas-peliculas', require('./idioma_pelicula_Routes.js'));
router.use('/patentes-roles', require('./patente_rol_Routes.js'));
router.use('/patentes-usuarios', require('./patente_Usuario_Routes.js'));
router.use('/peliculas-cines', require('./pelicula_cine_Routes.js'));
router.use('/compras-candy-detalles', require('./productoCandy_ComprasCandy_Routes.js'));
router.use('/proyecciones-peliculas', require('./proyeccion_pelicula_Routes.js'));




module.exports = router;