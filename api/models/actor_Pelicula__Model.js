const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Actor_Pelicula = sequelize.define(
    'Actor_Pelicula',
    {
        id_Actor: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        id_Pelicula: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
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

module.exports = { Actor_Pelicula }