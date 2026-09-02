const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const ClienteLogueado = sequelize.define(
    'ClienteLogueado',
    {
        id_ClienteLogueado: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Rol: DataTypes.TINYINT.UNSIGNED,
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
            validate: {
                isNumeric: true
            }
        },
        edad: DataTypes.TINYINT.UNSIGNED,
        telefono: {
            type: DataTypes.STRING(15),
            validate: {
                contains: '+',
                contains: '-',
                len: [15,15]
            }
        },
        email: {
            type: DataTypes.STRING(20),
            validate: {
                isEmail: true
            }
        },
        isActive: DataTypes.BOOLEAN,
        isLogged: DataTypes.BOOLEAN,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { ClienteLogueado }