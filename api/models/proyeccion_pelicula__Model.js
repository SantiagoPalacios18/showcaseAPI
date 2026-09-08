const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Proyeccion_pelicula = sequelize.define(
    'proyeccion_pelicula',
    {
        id_proyeccion: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        id_pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)


module.exports = { Proyeccion_pelicula }