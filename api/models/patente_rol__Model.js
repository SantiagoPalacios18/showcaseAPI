const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Patente_Rol = sequelize.define(
    'Patente_Rol',
    {
        id_PatenteRol: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
        },
        id_Patente: {
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
    }
)

module.exports = { Patente_Rol }