const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const compraTicket = sequelize.define(
    'compraTicket',
    {
        id_compraTicket: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_transaccion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        id_FuncionAsiento: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        precio: DataTypes.Int(8),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
       
    }
)


module.exports = { compraTicket }
