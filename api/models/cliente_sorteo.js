const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const cliente_sorteo = sequelize.define(
    'cliente_sorteo',
    {
        id_sorteo: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_cliente: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
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


module.exports = { cliente_sorteo }
