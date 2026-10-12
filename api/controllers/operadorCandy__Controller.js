const { OperadorCandy } = require('../models/index.js');

// GET: Obtener todos los operadores de Candy
const getOperadoresCandy = async (req, res) => {
    try {
        const operadores = await OperadorCandy.findAll();
        res.status(200).json(operadores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener operador por ID
const getOperadorCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const operador = await OperadorCandy.findByPk(id);

        if (!operador) {
            return res.status(404).json({ message: `Operador con el id: ${id} no encontrado` });
        }

        res.status(200).json(operador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear operador de Candy
const createOperadorCandy = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Usuario || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Usuario o DVH)"
            });
        }

        let extra = "";
        if ("id_operadorCandy" in data || "id_OperadorCandy" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevoOperador = await OperadorCandy.create({
            id_Usuario: data.id_Usuario,
            turno: data.turno || "Tarde",
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha registrado el operador correctamente." + extra,
            operadorCandy: nuevoOperador
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar operador
const modifyOperadorCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("id_Usuario" in data) datosCambiar.id_Usuario = data.id_Usuario;
        if ("turno" in data) datosCambiar.turno = data.turno;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await OperadorCandy.update(datosCambiar, {
            where: { id_operadorCandy: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Operador con el id: ${id} no encontrado` });
        }

        res.status(200).json({
            message: "El operador ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar operador
const deleteOperadorCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await OperadorCandy.destroy({ where: { id_operadorCandy: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el operador, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el operador de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getOperadoresCandy,
    getOperadorCandyById,
    createOperadorCandy,
    modifyOperadorCandyById,
    deleteOperadorCandyById
};