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
        columna: {
            type: DataTypes.TINYINT.UNSIGNED,
            unique: 'asientoPorFuncion'
        },
        fila: {
            type: DataTypes.SMALLINT.UNSIGNED,
            unique: 'asientoPorFuncion',
            validate: {
                esMultiploDeCien(value) {
                    if (value % 100 != 0) {
                        throw new Error("Solo multiplos de 100 Permitidos") 
                    }
                },
            }
        },
        DVH: {
            type: DataTypes.STRING(64),
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