const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const ProductoCandy_ComprasCandy = sequelize.define(
    'ProductoCandy_ComprasCandy',
    {
        id_ComprasCandy: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_ProductoCandy: {
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


module.exports = { ProductoCandy_ComprasCandy }
