const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Asiento = sequelize.define(
    'Asiento',
    {
        id_Asiento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Funcion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            unique: 'asientoPorFuncion'
        },
        numero: {
            type: DataTypes.TINYINT.UNSIGNED,
            unique: 'asientoPorFuncion'
        },
        fila: {
            type: DataTypes.STRING(1),
            unique: 'asientoPorFuncion',
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
        tableName: ''
    }
)

module.exports = { Asiento }