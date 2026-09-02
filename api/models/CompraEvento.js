const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const CompraEvento = sequelize.define(
    'CompraEvento',
    {
        id_CompraEvento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_ClienteLogueado: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: 'noFuncionesYCliente'
        },
        id_Funcion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            unique: 'noFuncionesYCliente'
        },
        tipo: DataTypes.STRING(10),
        pendiente: {
            type: DataTypes.BOOLEAN,
            default: 1
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

module.exports = { CompraEvento }    