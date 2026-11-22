const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Transaccion = sequelize.define(
    'transaccion',
    {
        id_Transaccion: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        total:DataTypes.INTEGER,
        fechaDeEmision: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW()
        },
        metodoDePago: DataTypes.STRING(15),
        DVH: {
            type: DataTypes.STRING(64),
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