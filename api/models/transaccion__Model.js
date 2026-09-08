const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Transaccion = sequelize.define(
    'transaccion',
    {
        id_transaccion: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_ClienteLogueado: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        total:DataTypes.INTEGER(8),
        fechaDeEmision: DataTypes.DATE,
        fechaVencimiento: DataTypes.DATE,
        metodoDePago: DataTypes.STRING(15),
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
    }
)


module.exports = { Transaccion }