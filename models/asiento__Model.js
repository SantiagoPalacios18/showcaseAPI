const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Asiento = sequelize.define(
    'Asiento',
    {
        id_Asiento: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        numero: DataTypes.SMALLINT.UNSIGNED,
        fila: DataTypes.SMALLINT.UNSIGNED,
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