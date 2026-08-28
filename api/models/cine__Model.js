const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Cine = sequelize.define(
    'Cine',
    {
        id_Cine: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING(15),
        ubicacion: DataTypes.STRING(20),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { Cine }