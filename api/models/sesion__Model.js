const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const Sesion = sequelize.define('Sesion', {
    id_Sesion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_Usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(Date.now() + 30 * 60 * 1000),
        allowNull: false
    },
    DVH: {
        type: DataTypes.STRING(64),
        allowNull: true,
        validate: {
            isAlphanumeric: true
        }
    }
}, {
    timestamps: false
});

module.exports = { Sesion };