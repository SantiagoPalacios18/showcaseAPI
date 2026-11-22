const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Idioma_Pelicula = sequelize.define(
    'idioma_pelicula',
    {
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        id_Idioma: {
            type: DataTypes.STRING(10),
            primaryKey: true
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


module.exports = { Idioma_Pelicula }
