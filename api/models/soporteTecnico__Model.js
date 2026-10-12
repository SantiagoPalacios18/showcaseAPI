
// sacar a la mierda, unificar con rol

const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const SoporteTecnico = sequelize.define(
    'soporteTecnico',
    {
        id_soporteTecnico: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        nombre: DataTypes.STRING(15),
        apellido: DataTypes.STRING(15),
        dni: DataTypes.INTEGER(10),
        telefono: DataTypes.INTEGER(17),
        mail: DataTypes.STRING(20),
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


module.exports = { SoporteTecnico }