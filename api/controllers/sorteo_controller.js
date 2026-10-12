const { Sorteo } = require('../models/index.js');

// GET: Obtener todos los sorteos
const getSorteos = async (req, res) => {
    try {
        const sorteos = await Sorteo.findAll();
        res.status(200).json(sorteos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener sorteo por ID
const getSorteoById = async (req, res) => {
    try {
        const { id } = req.params;
        const sorteo = await Sorteo.findByPk(id);

        if (!sorteo) {
            return res.status(404).json({ message: `Sorteo con el id: ${id} no encontrado` });
        }

        res.status(200).json(sorteo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear sorteo
const createSorteo = async (req, res) => {
    try {
        const data = req.body;

        if (!data.descripcion || !data.fecha_inicio || !data.fecha_fin || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (descripcion, fecha_inicio, fecha_fin o DVH)"
            });
        }

        let extra = "";
        if ("id_sorteo" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevoSorteo = await Sorteo.create({
            descripcion: data.descripcion,
            premio: data.premio || "Sin especificar",
            fecha_inicio: data.fecha_inicio,
            fecha_fin: data.fecha_fin,
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha creado el sorteo correctamente." + extra,
            sorteo: nuevoSorteo
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar sorteo
const modifySorteoById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("descripcion" in data) datosCambiar.descripcion = data.descripcion;
        if ("premio" in data) datosCambiar.premio = data.premio;
        if ("fecha_inicio" in data) datosCambiar.fecha_inicio = data.fecha_inicio;
        if ("fecha_fin" in data) datosCambiar.fecha_fin = data.fecha_fin;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Sorteo.update(datosCambiar, {
            where: { id_sorteo: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Sorteo con el id: ${id} no encontrado` });
        }

        res.status(200).json({
            message: "El sorteo ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar sorteo
const deleteSorteoById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await Sorteo.destroy({ where: { id_sorteo: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el sorteo, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el sorteo de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById
};