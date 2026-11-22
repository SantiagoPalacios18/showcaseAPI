const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Funcion = sequelize.define(
    'funcion',
    {
        id_Funcion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Sala: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        id_Tecnologia: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        id_Proyeccion: DataTypes.TINYINT.UNSIGNED,
        idioma: DataTypes.STRING(10),
        horarioInicio: DataTypes.DATE,
        precio: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
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
        tableName :"funcion",
        timestamps: false,
    }
)


module.exports = { Funcion }
