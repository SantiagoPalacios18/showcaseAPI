const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Idioma_pelicula = sequelize.define(
    'idioma_pelicula',
    {
        id_pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_idioma: {
            type: DataTypes.STRING(10),
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


module.exports = { Idioma_pelicula }
