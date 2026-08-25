const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Sala = sequelize.define(
    'Sala',
    {
        id_Sala: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Cine: DataTypes.TINYINT.UNSIGNED,
        cant_Asientos: DataTypes.SMALLINT.UNSIGNED,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { Sala }