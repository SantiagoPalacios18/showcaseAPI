const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const DVV = sequelize.define(
    'DVV',
    {
        tabla: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        dvv: {
            type: DataTypes.STRING(64),
            allowNull: false
        }
    },
    {
        tableName: 'dvv',
        timestamps: false
    }
);

module.exports = { DVV };
