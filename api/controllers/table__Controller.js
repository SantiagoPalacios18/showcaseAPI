const { sequelize } = require('../config/db.js');
const models = require('../models/index.js');
const AUTO_FIELDS = ['createdat', 'updatedat', 'deletedat'];

// Contrato que usa el panel para cualquier tabla:
// GET /{ruta}/
// POST /{ruta}/
// GET /{ruta}/getByPk/:pk
// PATCH /{ruta}/edit/:pk
// DELETE /{ruta}/:pk
// En claves compuestas, :pk son los segmentos en el orden de `pks` (pk1/pk2).
const RECURSOS = [
    { ruta: 'actores', modelo: 'Actor' },
    { ruta: 'actores-peliculas', modelo: 'Actor_Pelicula' },
    { ruta: 'asientos', modelo: 'Asiento' },
    { ruta: 'cines', modelo: 'Cine' },
    { ruta: 'clientes-sorteos', modelo: 'Usuario_sorteo' },
    { ruta: 'compras-candy', modelo: 'CompraCandy' },
    { ruta: 'compras-candy-detalles', modelo: 'ProductoCandy_ComprasCandy' },
    { ruta: 'compras-eventos', modelo: 'CompraEvento' },
    { ruta: 'compras-tickets', modelo: 'CompraTicket', pks: ['id_compraTicket'] },
    { ruta: 'funciones', modelo: 'Funcion' },
    { ruta: 'idiomas', modelo: 'Idioma' },
    { ruta: 'idiomas-peliculas', modelo: 'Idioma_pelicula' },
    { ruta: 'operadores-candy', modelo: 'OperadorCandy' },
    { ruta: 'patentes', modelo: 'Patente' },
    { ruta: 'patentes-roles', modelo: 'Patente_Rol' },
    { ruta: 'patentes-usuarios', modelo: 'Patente_Usuario' },
    { ruta: 'peliculas', modelo: 'Pelicula' },
    { ruta: 'peliculas-cines', modelo: 'Pelicula_cine' },
    { ruta: 'productos-candy', modelo: 'ProductoCandy' },
    { ruta: 'proyecciones', modelo: 'Proyeccion' },
    { ruta: 'proyecciones-peliculas', modelo: 'Proyeccion_pelicula' },
    { ruta: 'roles', modelo: 'Rol' },
    { ruta: 'salas', modelo: 'Sala' },
    { ruta: 'sesiones', modelo: 'Sesion' },
    { ruta: 'sorteos', modelo: 'Sorteo' },
    { ruta: 'soporte-tecnico', modelo: 'SoporteTecnico' },
    { ruta: 'tecnologias', modelo: 'Tecnologia' },
    { ruta: 'transacciones', modelo: 'Transaccion', pks: ['id_transaccion'] },
    { ruta: 'usuarios', modelo: 'Usuario' },
];

function nombreTabla(Model) {
    const tabla = Model.getTableName();
    return typeof tabla === 'string' ? tabla : tabla.tableName;
}

function clavesPrimarias(Model) {
    return Object.entries(Model.rawAttributes)
        .filter(([, attr]) => attr.primaryKey)
        .map(([nombre]) => nombre);
}

const getAllTables = async (req, res) => {
    try {
        const recursos = RECURSOS.map(({ ruta, modelo, pks }) => {
            const Model = models[modelo];
            if (!Model) return null;
            return {
                ruta,
                tabla: nombreTabla(Model),
                pks: pks || clavesPrimarias(Model),
            };
        }).filter(Boolean);

        res.status(200).json(recursos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las tablas" });
    }
};

const getTableFields = async (req, res) => {
    try {
        const { tabla } = req.params;
        const qi = sequelize.getQueryInterface();

        const existentes = (await qi.showAllTables())
            .map(t => (typeof t === 'string' ? t : t.tableName));
        const real = existentes.find((nombre) => nombre.toLowerCase() === String(tabla).toLowerCase());
        if (!real) {
            return res.status(404).json({ message: "Tabla inexistente" });
        }

        const descripcion = await qi.describeTable(real);

        const campos = Object.entries(descripcion)
            .filter(([nombre, info]) =>
                !info.autoIncrement && !AUTO_FIELDS.includes(nombre.toLowerCase())
            )
            .map(([nombre, info]) => ({
                name: nombre,
                type: String(info.type).toUpperCase(),
                required: !info.allowNull && info.defaultValue == null,
                primaryKey: info.primaryKey,
            }));

        res.json(campos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los campos" });
    }
};

module.exports = { getAllTables, getTableFields };
