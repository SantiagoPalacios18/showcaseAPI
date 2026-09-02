const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const AdministradorBD = sequelize.define(
    'AdministradorBD',
    {
        id_Administador: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Rol: {
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 'Admin'
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
                len: [13,13],
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
        tableName: ''
    }
)

module.exports = { AdministradorBD }