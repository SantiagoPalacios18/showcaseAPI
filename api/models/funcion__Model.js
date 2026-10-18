const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Funcion = sequelize.define(
    'funcion',
    {
        id_Funcion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
        },
        id_sala: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        id_pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        id_tecnologia: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        idioma: DataTypes.STRING(10),
        proyeccion: DataTypes.STRING(10),
        horarioInicio: DataTypes.DATE,
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


module.exports = { Funcion }
