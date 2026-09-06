const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const transaccion = sequelize.define(
    'transaccion',
    {
        id_transaccion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        total:DataTypes.int(8),
        fechaDeEmision: DataTypes.DATE,
        fechaVencimiento: DataTypes.DATE,
        metodoDePago: DataTypes.STRING(15),
        estado: DataTypes.BOOLEAN,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { transaccion }