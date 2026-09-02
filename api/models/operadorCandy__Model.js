const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Operador_Candy = sequelize.define(
    'Operador_Candy',
    {
        id_OperadorCandy: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Rol: {
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 'OperadorCandy'
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
        DNI: {
            type: DataTypes.STRING(10),
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        telefono: {
            type: DataTypes.STRING(15),
            validate: {
                isNumeric: true
            }
        },
        email: {
            type: DataTypes.STRING(20),
            unique: true,
            validate: {
                isEmail: true
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

module.exports = { Operador_Candy }