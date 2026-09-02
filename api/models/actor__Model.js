const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Actor = sequelize.define(
    'Actor',
    {
        id_Actor: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(15),
            validate: {
                isAlpha: true
            }
        },
        apellido: {
            type: DataTypes.STRING(15),
            validate: {
                isAlpha: true
            }
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
        tableName: 'actores'
    }
)

module.exports = { Actor }