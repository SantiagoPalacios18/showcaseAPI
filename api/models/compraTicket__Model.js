const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const CompraTicket = sequelize.define(
    'compraTicket',
    {
        id_compraTicket: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_transaccion: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        id_FuncionAsiento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
        },
        precio: DataTypes.SMALLINT(5),
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


module.exports = { CompraTicket }
