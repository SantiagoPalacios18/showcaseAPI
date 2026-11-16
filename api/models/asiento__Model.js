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
                        throw new Error("Solo multiplos de 100 Permitidos") //throw devuelve una excepcion, que frena por completo la ejecucion del programa (salvo que esté en un try, catch, en ese caso salta al catch). Se lanza la excepcion new Error() para mayor claridad
                    }
                },
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