const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const tecnologia = sequelize.define(
    'tecnologia',
    {
        id_tecnologia: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING(15),
        descripcion: DataTypes.STRING(20),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { tecnologia }