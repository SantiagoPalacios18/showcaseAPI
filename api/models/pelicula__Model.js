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
        titulo:{
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        genero: DataTypes.STRING(15),
        origen: {
            type: DataTypes.STRING(20),
            validate: {
            },
        },
        id_Director: {
            type: DataTypes.STRING(20),
            validate: {
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
        imagen: {
            type: DataTypes.STRING,
        },
        duracion: DataTypes.TIME,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: true,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)

module.exports = { Pelicula }