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
        stock: DataTypes.MEDIUMINT.UNSIGNED,
        nombre: DataTypes.STRING(15),
        categoria: DataTypes.STRING(15),
        precio: DataTypes.MEDIUMINT.UNSIGNED,
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