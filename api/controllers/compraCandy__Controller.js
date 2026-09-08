const { CompraCandy } = require('../models/index.js');

const getComprasCandy = async (req, res) => {
    try {
        const comprasCandy = await CompraCandy.findAll();
        res.status(200).json(comprasCandy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET: Obtener una compra por ID
const getCompraCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const compraCandy = await compraCandy.findByPk(id);

        if (!compraCandy) {
            return res.status(404).json({ message: `compraCandy con el id: ${id} no encontrado` });
        }

        res.status(200).json(compraCandy);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST: Crear una nueva compra Candy
const createCompraCandy = async (req, res) => {
    try {
        const data = req.body;
        /*
        if (!data.nombre || !data.ubicacion || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, ubicacion o DVH)"
            });
        }*/

        let extra = "";
        if ("id_CompraCandy" in data) {
            extra = " Alerta: El campo id_compraCandy no es modificable, se estableció otro";
        }

        const nuevaCompraCandy = await CompraCandy.create({
            nombre: data.nombre,
            ubicacion: data.ubicacion,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el compraCandy correctamente." + extra, compraCandy: nuevaCompraCandy });
    } catch (error) {
        res.status(500).json({ error: error.response.data.errors[0].message });
    }
}

// PATCH: Modificar parcialmente un compraCandy en base a su ID
const modifyCompraCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};
        
        if ("nombre" in data) {
            datosCambiar.nombre = data.nombre;
        }
        if ("ubicacion" in data) {
            datosCambiar.ubicacion = data.ubicacion;
        }
        if ("DVH" in data) {
            datosCambiar.DVH = data.DVH;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await CompraCandy.update(datosCambiar, { where: { id_compraCandy: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `CompraCandy con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El CompraCandy ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteCompraCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const CompraCandyEliminados = await CompraCandy.destroy({ where: { id_CompraCandy: id } });

        if (CompraCandyEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado la compra del candy, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente la compra candy de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getComprasCandy,
    getCompraCandyById,
    createCompraCandy,
    modifyCompraCandyById,
    deleteCompraCandyById,
};