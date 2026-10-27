const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Code = sequelize.define(
    'Code', {
        id_Code: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        code: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 30 * 60 * 1000)
        }
    },
    {
        timestamps: false,
        tableName: 'codes'
    }
);

module.exports = {Code}