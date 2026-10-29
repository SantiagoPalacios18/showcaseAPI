const { Usuario_sorteo } = require('../models/index.js');

// GET: Obtener todos los clientes en sorteos
const getClientesSorteos = async (req, res) => {
    try {
        const registros = await Usuario_sorteo.findAll();
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener registros por ID de sorteo
const getClientesBySorteoId = async (req, res) => {
    try {
        const { id_sorteo } = req.params;
        const registros = await Usuario_sorteo.findAll({
            where: { id_sorteo }
        });

        const { id_Usuario } = req.params;
        const registros2 = await Usuario_sorteo.findAll({
            where: { id_sorteo, id_Usuario}
        });

        if (registros.length === 0) {
            return res.status(404).json({ message: `No se encontraron clientes para el sorteo: ${id_sorteo}` });
        }

        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Inscribir cliente a sorteo
const createClienteSorteo = async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body)

        if (!data.id_Cliente || !data.id_sorteo || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Cliente, id_sorteo o DVH)"
            });
        }

        const existe = await Usuario_sorteo.findOne({
            where: {
                id_Usuario: data.id_Cliente,
                id_sorteo: data.id_sorteo
            }
        });

        if (existe) {
            return res.status(400).json({ message: "El cliente ya está inscripto en este sorteo" });
        }

        const nuevoRegistro = await Usuario_sorteo.create({
            id_Usuario: data.id_Cliente,
            id_sorteo: data.id_sorteo,
            fecha_inscripcion: data.fecha_inscripcion || undefined,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Cliente inscripto al sorteo correctamente.",
            clienteSorteo: nuevoRegistro
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente (DVH / fecha)
const modifyClienteSorteo = async (req, res) => {
    try {
        const { id_Cliente, id_sorteo } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("fecha_inscripcion" in data) datosCambiar.fecha_inscripcion = data.fecha_inscripcion;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Usuario_sorteo.update(datosCambiar, {
            where: { id_Cliente, id_sorteo }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: "Registro no encontrado para modificar" });
        }

        res.status(200).json({
            message: "Registro modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Quitar cliente del sorteo
const deleteClienteSorteo = async (req, res) => {
    try {
        const { id_Cliente, id_sorteo } = req.params;
        const eliminadas = await Usuario_sorteo.destroy({
            where: { id_Cliente, id_sorteo }
        });

        if (eliminadas === 0) {
            return res.status(400).json({ message: "No se encontró el registro" });
        }

        res.status(200).json({
            message: `Cliente ${id_Cliente} quitado del sorteo ${id_sorteo} correctamente.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getClientesSorteos,
    getClientesBySorteoId,
    createClienteSorteo,
    modifyClienteSorteo,
    deleteClienteSorteo
};