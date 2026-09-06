const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const compraTicket = sequelize.define(
    'compraTicket',
    {
        id_compraTicket: {
            type: DataTypes.INT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_transaccion: {
            type: DataTypes.INT.UNSIGNED,
            primaryKey: true,
        },
        id_FuncionAsiento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
        },
        precio: DataTypes.smallInt(5),
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


module.exports = { compraTicket }
