const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Patente_Usuario = sequelize.define(
    'Patente_Usuario',
    {
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true
        },
        id_Patente: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true
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
        tableName: 'Patente_Usuario'
    }
);

module.exports = { Patente_Usuario };