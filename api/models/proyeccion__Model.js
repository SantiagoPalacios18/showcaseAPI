const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Proyeccion = sequelize.define(
    'Proyeccion',
    {
        id_Proyeccion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        formato: DataTypes.STRING(10),
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