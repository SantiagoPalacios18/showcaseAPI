const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const DVV = sequelize.define(
    'DVV',
    {
        tabla: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        DVV: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        tableName: 'dvv',
        timestamps: false
    }
);

module.exports = { DVV };
