const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Cine = sequelize.define(
    'Cine',
    {
        id_Cine: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: {
            type: DataTypes.STRING(15),
            unique: true
        },
        ubicacion: {
            type: DataTypes.STRING(20),
            unique: true,
            validate: {
                contains: ' ' 
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
    }
)

module.exports = { Cine }