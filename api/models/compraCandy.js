const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const CompraCandy = sequelize.define(
    'CompraCandy',
    {
        id_CompraCandy: {
            type: DataTypes.SMALLINT.UNSIGNED,
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

module.exports = { CompraCandy }    