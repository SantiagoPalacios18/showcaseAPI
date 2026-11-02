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
            type: DataTypes.STRING(15),
            validate: {
                isAlpha: true
            }
        },
        fecha_sor:{
            type: DataTypes.DATE,
        },
        infoGral:{
            type: DataTypes.STRING(30),
        },
        imagen: {
            type: DataTypes.STRING,
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