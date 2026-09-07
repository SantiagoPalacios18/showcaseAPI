const { } = require('../models/index.js');


const { Asiento } = require('../../models/index.js');

// Obtener todos los asientos
const getAsientos = async (req, res) => {
    try {
        const asientos = await Asiento.findAll();
        res.status(200).json(asientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener un asiento por ID
const getAsientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const asiento = await Asiento.findByPk(id);

        if (!asiento) {
            return res.status(404).json({ message: `Asiento con el id: ${id} no encontrado` });
        }

        res.status(200).json(asiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear un nuevo asiento
const createAsiento = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Funcion || !data.numero || !data.fila || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Funcion, numero, fila o DVH)"
            });
        }

        let extra = "";
        if ("id_Asiento" in data) {
            extra = " Alerta: El campo id_Asiento no es modificable, se estableció otro";
        }

        const nuevoAsiento = await Asiento.create({
            id_Funcion: data.id_Funcion,
            numero: data.numero,
            fila: data.fila,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el asiento correctamente." + extra, asiento: nuevoAsiento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Modificar parcialmente un asiento en base a su ID
const modifyAsientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Funcion" in data) {
            datosCambiar.id_Funcion = data.id_Funcion;
        }
        
        if ("numero" in data) {
            datosCambiar.numero = data.numero;
        }
        if ("fila" in data) {
            datosCambiar.fila = data.fila;
        }
        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Asiento.update(datosCambiar, { where: { id_Asiento: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Asiento con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El asiento ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar el registro de un asiento en base a su ID
const deleteAsientoById = async (req, res) => {
    try {
        const { id } = req.params;
        const asientosEliminados = await Asiento.destroy({ where: { id_Asiento: id } });

        if (asientosEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado el asiento, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el asiento de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAsientos,
    getAsientoById,
    createAsiento,
    modifyAsientoById,
    deleteAsientoById,
}


