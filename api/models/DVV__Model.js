const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');


const DVV = sequelize.define(
    'DVV',
    {
        tabla: {
            type: DataTypes.STRING(15)
        },
        // falta la tabla del dvv que dsp la hago
    },
    {
        timestamps: false,
    }
)


module.exports = { DVV }
