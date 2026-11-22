const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Bitacora = sequelize.define(
    'Bitacora',
    {
        id_Bitacora: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        accion: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        tabla: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_Registro: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        /*descripcion: {
            type: DataTypes.TEXT
        },*/
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
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
        tableName: 'bitacora',
        timestamps: false
    }
);

module.exports = { Bitacora };
