const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Bitacora = sequelize.define('Bitacora',
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
            defaultValue: DataTypes.NOW
        }   
    },
    {
        timestamps: false
    }
);