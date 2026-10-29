const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Sorteo = sequelize.define(
    'sorteo',
    {
        id_sorteo: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: {
            type: DataTypes.STRING(15),
            validate: {
                isAlpha: true
            }
        },
        requisitosloged:{
            
        },
        infoGral:{
            type: DataTypes.STRING(30),
        },
        premio: DataTypes.STRING(30),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    },
    {
        timestamps: false,
    }
)


module.exports = { Sorteo }