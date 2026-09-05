const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const idioma = sequelize.define(
    'idioma',
    {
        id_idioma: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
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


module.exports = { idioma }