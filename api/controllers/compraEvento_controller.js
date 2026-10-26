const { CompraEvento } = require('../models/index.js');

// GET: Obtener todas las compras de eventos y reservas
const getComprasEventos = async (req, res) => {
    try {
        const compras = await CompraEvento.findAll();
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener compra o reserva por ID
const getCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await CompraEvento.findByPk(id);

        if (!compra) {
            return res.status(404).json({ message: `Registro con el id: ${id} no encontrado` });
        }

        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear compra de evento o reserva (Salida Grupal, Corporativo, Cumpleaños)
const createCompraEvento = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.tipo || data.monto_total === undefined) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario, tipo o monto_total)"
            });
        }

        let extra = "";
        if ("id_CompraEvento" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        // Validación de negocio: Descuento automático si supera las 25 personas
        const cantidadPersonas = data.cantidad_personas || 1;
        const aplicóDescuento = cantidadPersonas > 25;

        const nuevaCompra = await CompraEvento.create({
            id_Usuario: data.id_Usuario,
            id_Funcion: data.id_Funcion || null,
            id_Espacio: data.id_Espacio || null,
            tipo: data.tipo,
            cantidad_personas: cantidadPersonas,
            detalle_comida_bebida: data.detalle_comida_bebida || null,
            fecha_hora_reserva: data.fecha_hora_reserva || new Date(),
            monto_total: data.monto_total,
            aplicó_descuento: aplicóDescuento,
            pendiente: data.pendiente !== undefined ? data.pendiente : true,
            DVH: "DVH123" // Campo obligatorio exigido por el modelo/base de datos
        });

        res.status(201).json({
            message: "Se ha registrado la reserva/compra correctamente." + extra,
            compraEvento: nuevaCompra
        });
    } catch (error) {
        console.error("--- ERROR DETALLADO DE SEQUELIZE ---");
        console.error("Mensaje:", error.message);
        if (error.errors) {
            error.errors.forEach(err => console.error(`- Campo (${err.path}): ${err.message}`));
        }
        console.error("-------------------------------------");

        res.status(500).json({ error: error.message, details: error.errors });
    }
};

// PATCH: Modificar compra de evento o reserva
const modifyCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Usuario" in data) datosCambiar.id_Usuario = data.id_Usuario;
        if ("id_Funcion" in data) datosCambiar.id_Funcion = data.id_Funcion;
        if ("id_Espacio" in data) datosCambiar.id_Espacio = data.id_Espacio;
        if ("tipo" in data) datosCambiar.tipo = data.tipo;
        if ("cantidad_personas" in data) {
            datosCambiar.cantidad_personas = data.cantidad_personas;
            datosCambiar.aplicó_descuento = data.cantidad_personas > 25;
        }
        if ("detalle_comida_bebida" in data) datosCambiar.detalle_comida_bebida = data.detalle_comida_bebida;
        if ("fecha_hora_reserva" in data) datosCambiar.fecha_hora_reserva = data.fecha_hora_reserva;
        if ("monto_total" in data) datosCambiar.monto_total = data.monto_total;
        if ("pendiente" in data) datosCambiar.pendiente = data.pendiente;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await CompraEvento.update(datosCambiar, {
            where: { id_CompraEvento: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Registro con el id: ${id} no encontrado` });
        }

        res.status(200).json({
            message: "El registro ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar compra de evento o reserva
const deleteCompraEventoById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await CompraEvento.destroy({ where: { id_CompraEvento: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el registro, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el registro de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getComprasEventos,
    getCompraEventoById,
    createCompraEvento,
    modifyCompraEventoById,
    deleteCompraEventoById
};