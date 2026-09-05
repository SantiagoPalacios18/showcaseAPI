const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Usuario = sequelize.define(
    'Usuario',
    {
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Rol: {
            type: DataTypes.TINYINT.UNSIGNED,
            default: 'Usuario'
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
        edad: DataTypes.TINYINT.UNSIGNED,
        DNI: {
            type: DataTypes.STRING(10),
            unique: true,
            validate: {
                isNumeric: true
            }
        },
        telefono: {
            type: DataTypes.STRING(13),
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
        contraseña: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            default: 1
        },
        isLogged: {
            type: DataTypes.BOOLEAN,
            default: 1
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: /* deberia ser false pero como tengo interferencias con el registro le pongo*/ true,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)

module.exports = { Usuario }