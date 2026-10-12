const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Usuario_sorteo = sequelize.define(
    'Usuario_sorteo',
    {
        id_sorteo: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        id_Usuario: {
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


module.exports = { Usuario_sorteo }
