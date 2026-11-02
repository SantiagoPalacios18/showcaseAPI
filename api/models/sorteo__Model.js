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
        id_Pelicula: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: true,
        },
        nombre: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        infoGral:{
            type: DataTypes.STRING(120),
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING,
        },
        premio: {
            type: DataTypes.JSON, //cambiado a JSON para almacenar una lista de premios organizada: premio: {premio1: X, premio2: Y}
            allowNull: false
        },
        DVH: {
            type: DataTypes.STRING(6),
            allowNull: true, // Se cambia a false una vez tengamos el sistema de dvv/dvh programado
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