const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Pelicula = sequelize.define(
    'Pelicula',
    {
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        genero: DataTypes.STRING(15),
        origen: {
            type: DataTypes.STRING(20),
            validate: {
                isAlpha: true
            },
        },
        id_Director: {
            type: DataTypes.STRING(20),
            validate: {
                isAlpha: true,
                contains: [" "]
            },
        },
        calificacion: {
            type: DataTypes.TINYINT(2).UNSIGNED,
            default: 0,
            validate: {
                max: 10,
                min: 0
            },
        },
        duracion: DataTypes.TIME,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { Pelicula }