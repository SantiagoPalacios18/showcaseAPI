const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Usuario_Sorteo = sequelize.define(
    'Usuario_sorteo',
    {
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        id_Sorteo: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
        },
        fecha_inscripcion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: true,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)


module.exports = { Usuario_Sorteo }
