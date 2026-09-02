const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Proyeccion = sequelize.define(
    'Proyeccion',
    {
        id_Proyeccion: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        formato: {
            type: DataTypes.STRING(10),
            unique: true
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

module.exports = { Proyeccion }