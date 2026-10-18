const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Rol = sequelize.define(
    'Rol',
    {
        id_Rol: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: {
            type: DataTypes.STRING(15),
            unique: true
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: true,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)

module.exports = { Rol }