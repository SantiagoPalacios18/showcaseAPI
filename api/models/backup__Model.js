const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Backup = sequelize.define(
    'Backup',
    {
        id_Backup: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        ruta: {
            type: DataTypes.STRING(255),
            validate: {
                isUrl: true
            }
        },
        fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        descripcion: {
            type: DataTypes.STRING(200),
            allowNull: false
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
        tableName: 'Backup',
        timestamps: false
    }
);

module.exports = { Backup };
