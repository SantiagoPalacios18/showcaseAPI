const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Hobby = sequelize.define('Hobby', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'hobbies',
  timestamps: false
});




module.exports = { Hobby };