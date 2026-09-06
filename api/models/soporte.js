const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const sorteo = sequelize.define(
    'sorteo',
    {
        id_sorteo: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        premio: DataTypes.STRING(30),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { sorteo }