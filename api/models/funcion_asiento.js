const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const Funcion_Asiento = sequelize.define(
    'Funcion_Asiento',
    {
        tabla: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement:true
        },
        // falta la tabla del dvv que dsp la hago
    }
)


module.exports = { Funcion_Asiento }
