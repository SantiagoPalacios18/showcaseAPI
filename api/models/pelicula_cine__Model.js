const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Pelicula_cine = sequelize.define(
    'pelicula_cine',
    {
        id_cine: {
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


module.exports = { Pelicula_cine }