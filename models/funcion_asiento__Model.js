const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Funcion_Asiento = sequelize.define(
    'Funcion_Asiento',
    {
        id_FuncionAsiento: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        id_Asiento: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        ocupado: DataTypes.BOOLEAN,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { Funcion_Asiento }