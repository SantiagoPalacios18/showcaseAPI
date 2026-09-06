const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const soporteTecnico = sequelize.define(
    'soporteTecnico',
    {
        id_soporteTecnico: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING(15),
        apellido: DataTypes.STRING(15),
        dni: DataTypes.int(10),
        telefono: DataTypes.int(17),
        mail: DataTypes.STRING(20),
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { soporteTecnico }