const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Idioma = sequelize.define(
    'idioma',
    {
        id_idioma: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(15),
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
    },
    {
        timestamps: false,
    }
)


module.exports = { Idioma }