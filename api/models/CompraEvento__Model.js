const { sequelize } = require('../config/db.js');
const { DataTypes } = require('sequelize');

const CompraEvento = sequelize.define(
    'CompraEvento',
    {
        id_CompraEvento: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        id_Usuario: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            unique: 'noFuncionesYCliente'
        },
        id_Funcion: {
            type: DataTypes.MEDIUMINT.UNSIGNED,
            allowNull: true, // Nulo para reservas de espacios (corporativos / cumpleaños) que no dependen de una función de cine
            unique: 'noFuncionesYCliente'
        },
        id_Sala: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: true // Nulo para compra de tickets grupales de cine
        },
        tipo: {
            type: DataTypes.STRING(30), // Ampliado para soportar "Grupal", "Corporativo", "Cumpleaños"
            allowNull: false
        },
        cantidad_personas: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
            defaultValue: 1
        },
        detalle_comida_bebida: {
            type: DataTypes.TEXT,
            allowNull: true // Requerido para eventos corporativos y cumpleaños
        },
        fecha_hora_reserva: {
            type: DataTypes.DATE,
            allowNull: false
        },
        monto_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        aplicó_descuento: {
            type: DataTypes.BOOLEAN,
            defaultValue: false // Maneja la regla de más de 25 personas
        },
        pendiente: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
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
        tableName: 'compra_evento'
    }
);

module.exports = { CompraEvento };