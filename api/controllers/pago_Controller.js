const { MercadoPagoConfig, Preference } = require('mercadopago');
const { CompraEvento } = require('../models/index.js'); // ✅ Corregido al índice general

// Configura tus credenciales de Mercado Pago (reemplaza con tu Access Token de prueba)
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-5809000816161778-102918-87ad1878260a915bdd2071d7a80e6bc5-3800208117'
});

const crearPreferenciaCompraEvento = async (req, res) => {
    try {
        // Solo necesitamos el ID de la compra que acabamos de registrar en la BD
        const { id_CompraEvento } = req.body;

        // 1. Buscamos la compra en la base de datos para extraer el precio real ya calculado
        const compra = await CompraEvento.findByPk(id_CompraEvento);
        if (!compra) {
            return res.status(404).json({ message: "Compra de evento no encontrada" });
        }

        const preference = new Preference(client);

        // 2. Creamos la preferencia usando el monto_total oficial de la BD
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: String(compra.id_CompraEvento),
                        title: `Reserva de Evento (${compra.tipo})`,
                        quantity: 1, // Lo pasamos como 1 unidad contenedora del monto total
                        unit_price: Number(compra.monto_total), // El total exacto que ya calculó tu sistema
                        currency_id: 'ARS'
                    }
                ],
                back_urls: {
                    success: "http://localhost:5173/pago-exitoso",
                    failure: "http://localhost:5173/pago-fallido",
                    pending: "http://localhost:5173/pago-pendiente"
                },
                //auto_return: "approved",
                external_reference: String(id_CompraEvento) // Clave para identificar la compra en el webhook
            }
        });

        // Retornamos el link de pago para redirigir desde React
        return res.status(200).json({
            preferenceId: result.id,
            init_point: result.init_point 
        });

    } catch (error) {
        console.error("Error al crear la preferencia de Mercado Pago:", error);
        return res.status(500).json({ error: error.message });
    }
};

// Webhook opcional para cuando Mercado Pago avisa que se pagó
const recibirWebhook = async (req, res) => {
    try {
        const payment = req.query;
        // Aquí puedes procesar la notificación de pago y actualizar compra.pendiente = false
        console.log("Notificación recibida de MP:", payment);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error en webhook:", error);
        res.sendStatus(500);
    }
};

module.exports = {
    crearPreferenciaCompraEvento,
    recibirWebhook
};