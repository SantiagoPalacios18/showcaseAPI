const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const proyeccion_pelicula = sequelize.define(
    'proyeccion_pelicula',
    {
        id_proyeccion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_pelicula: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { proyeccion_pelicula }