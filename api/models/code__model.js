const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Code = sequelize.define(
    'Code', {
        id_Code: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Usuario: DataTypes.INTEGER.UNSIGNED,
        code: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: () => new Date(Date.now() + 30 * 60 * 1000)
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
        tableName: 'codes'
    }
);

module.exports = {Code}