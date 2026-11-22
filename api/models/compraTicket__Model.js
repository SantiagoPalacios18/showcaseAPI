const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const CompraTicket = sequelize.define(
    'compraTicket',
    {
        id_CompraTicket: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Transaccion: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        id_Asiento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
        },
        precio: DataTypes.SMALLINT.UNSIGNED,
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


module.exports = { CompraTicket }
