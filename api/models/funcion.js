const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const funcion = sequelize.define(
    'funcion',
    {
        id_compraTicket: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_sala: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        id_pelicula: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        id_tecnologia: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
        },
        idioma: DataTypes.STRING(10),
        proyeccion: DataTypes.STRING(10),
        horarioInicio: DataTypes.DATETIME,
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isAlphanumeric: true
            }
        }
    }
)


module.exports = { funcion }
