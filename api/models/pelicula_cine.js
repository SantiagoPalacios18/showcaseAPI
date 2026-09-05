const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const pelicula_cine = sequelize.define(
    'pelicula_cine',
    {
        id_cine: {
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


module.exports = { pelicula_cine }