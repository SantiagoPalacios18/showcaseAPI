const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Pelicula_cine = sequelize.define(
    'pelicula_cine',
    {
        id_Cine: {
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


module.exports = { Pelicula_cine }