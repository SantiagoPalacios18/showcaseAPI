const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const AdministradorBD = sequelize.define(
    'AdministradorBD',
    {
        id_Administador: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Rol: DataTypes.MEDIUMINT.UNSIGNED,
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
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { AdministradorBD }