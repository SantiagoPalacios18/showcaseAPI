const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const ProductoCandy = sequelize.define(
    'ProductoCandy',
    {
        id_ProductoCandy: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        genero: DataTypes.STRING(15),
        origen: {
            type: DataTypes.STRING(20),
            validate: {
                isAlpha: true
            },
        },
        director: {
            type: DataTypes.STRING(20),
            validate: {
                isAlpha: true,
                contains: [" "]
            },
        },
        calificacion: {
            type: DataTypes.TINYINT.UNSIGNED(2),
            validate: {
                max: 10,
                min: 0
            },
        },
        duracion: DataTypes.TIME,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)

module.exports = { ProductoCandy }