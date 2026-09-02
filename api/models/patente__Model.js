const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Patente = sequelize.define(
    'Patente',
    {
        id_Patente: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING(15),
        descripcion: DataTypes.TEXT,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { Patente }