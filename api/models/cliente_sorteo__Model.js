const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Cliente_sorteo = sequelize.define(
    'cliente_sorteo',
    {
        id_sorteo: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        id_cliente: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
        },
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


module.exports = { Cliente_sorteo }
