const { ProductoCandy } = require('../models/index.js');

// GET: Obtener todos los productos del Candy
const getProductosCandy = async (req, res) => {
    try {
        const productos = await ProductoCandy.findAll();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET: Obtener un producto del Candy por ID
const getProductoCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await ProductoCandy.findByPk(id);

        if (!producto) {
            return res.status(404).json({ message: `Producto con el id: ${id} no encontrado` });
        }

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST: Crear un nuevo producto en Candy
const createProductoCandy = async (req, res) => {
    try {
        const data = req.body;

        if (!data.nombre || !data.precio || !data.stock || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, precio, stock o DVH)"
            });
        }

        let extra = "";
        if ("id_productoCandy" in data || "id_ProductoCandy" in data) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const nuevoProducto = await ProductoCandy.create({
            nombre: data.nombre,
            precio: data.precio,
            stock: data.stock,
            descripcion: data.descripcion || "",
            DVH: data.DVH
        });

        res.status(200).json({
            message: "Se ha creado el producto correctamente." + extra,
            productoCandy: nuevoProducto
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH: Modificar parcialmente un producto
const modifyProductoCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};

        if ("nombre" in data) datosCambiar.nombre = data.nombre;
        if ("precio" in data) datosCambiar.precio = data.precio;
        if ("stock" in data) datosCambiar.stock = data.stock;
        if ("descripcion" in data) datosCambiar.descripcion = data.descripcion;
        if ("DVH" in data) datosCambiar.DVH = data.DVH;

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await ProductoCandy.update(datosCambiar, {
            where: { id_productoCandy: id }
        });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `Producto con el id: ${id} no encontrado` });
        }

        res.status(200).json({
            message: "El producto ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE: Eliminar un producto
const deleteProductoCandyById = async (req, res) => {
    try {
        const { id } = req.params;
        const filas = await ProductoCandy.destroy({ where: { id_productoCandy: id } });

        if (filas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el producto, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el producto de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProductosCandy,
    getProductoCandyById,
    createProductoCandy,
    modifyProductoCandyById,
    deleteProductoCandyById
};