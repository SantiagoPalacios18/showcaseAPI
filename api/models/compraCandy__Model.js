const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const CompraCandy = sequelize.define(
    'CompraCandy',
    {
        id_CompraCandy: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_ClienteLogueado: DataTypes.INTEGER.UNSIGNED,
        total: DataTypes.MEDIUMINT.UNSIGNED,
        fechaEmision: DataTypes.NOW,
        fechaVencimiento: {
            type: DataTypes.DATE,
            validate: {
                vencimientoPosible(value) {
                    if (value <= this.fechaEmision) {
                        throw new Error("Una compra no puede vencer antes ni al instante de ser emitida")
                    }
                }
            }
        },
        metodoPago: DataTypes.STRING(10),
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
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

module.exports = { CompraCandy }