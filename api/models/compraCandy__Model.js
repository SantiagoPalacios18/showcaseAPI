const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const CompraCandy = sequelize.define(
    'CompraCandy',
    {
        id_CompraCandy: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_ClienteLogueado: DataTypes.SMALLINT.UNSIGNED,
        total: DataTypes.SMALLINT.UNSIGNED,
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

module.exports = { CompraCandy }