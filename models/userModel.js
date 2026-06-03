const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false // Evita buscar createdAt y updatedAt
});


module.exports = { User };