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
            type: DataTypes.STRING(60), 
            allowNull: false,
        },
        genero: DataTypes.STRING(15), 
        origen: {
            type: DataTypes.STRING(20) 
        },
        enCartelera: {
            type: DataTypes.BOOLEAN, 
            defaultValue: 1
        },
        director: {
            type: DataTypes.STRING(20), 
        },
        calificacion: {
            type: DataTypes.TINYINT(2).UNSIGNED, 
            default: 0,
            validate: {
                max: 10,
                min: 0
            },
        },
        calificaciones:{
            type: DataTypes.MEDIUMINT.UNSIGNED,
            defaultValue: 0
        },
        imagen: {
            type: DataTypes.STRING(200), 
        },
        duracion: DataTypes.TIME, 
        DVH: {
            type: DataTypes.STRING(64),
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