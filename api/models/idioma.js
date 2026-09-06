const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const idioma = sequelize.define(
    'idioma',
    {
        id_idioma: {
            type: DataTypes.STRING(10)
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


module.exports = { idioma }