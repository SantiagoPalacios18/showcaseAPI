const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Proyeccion_Pelicula = sequelize.define(
    'proyeccion_pelicula',
    {
        id_Proyeccion: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        DVH: {
            type: DataTypes.STRING(64),
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


module.exports = { Proyeccion_Pelicula }