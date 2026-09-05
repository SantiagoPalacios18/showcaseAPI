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
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = { Sesion };