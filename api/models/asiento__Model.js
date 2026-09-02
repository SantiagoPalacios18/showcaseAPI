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
        id_Funcion: DataTypes.MEDIUMINT.UNSIGNED,
        numero: DataTypes.TINYINT.UNSIGNED,
        fila: {
            type: DataTypes.STRING(1),
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
    }
)

module.exports = { Asiento }