const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Sorteo = sequelize.define(
    'sorteo',
    {
        id_Sorteo: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: true,
        },
        id_Ganador:{
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        fecha_sor:{
            type: DataTypes.DATE,
        },
        infoGral:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(200),
        },
        premio: {
            type: DataTypes.JSON, //cambiado a JSON para almacenar una lista de premios organizada: premio: {premio1: X, premio2: Y}
            allowNull: false
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
    }
)


module.exports = { Sorteo }