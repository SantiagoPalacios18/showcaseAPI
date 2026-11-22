const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Idioma = sequelize.define(
    'idioma',
    {
        id_Idioma: {
            type: DataTypes.STRING(10),
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(15),
            unique: true,
            validate: {
                isAlpha: true
            }
        },
        DVH: {
            type: DataTypes.STRING(64),
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