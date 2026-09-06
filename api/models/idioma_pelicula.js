const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const idioma_pelicula = sequelize.define(
    'idioma_pelicula',
    {
        id_pelicula: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_idioma: {
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


module.exports = { idioma_pelicula }
