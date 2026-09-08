const { Funcion } = require('../models/index.js');

// GET: Obtener todos los funcions
const getFunciones = async (req, res) => {
    try {
        const funciones = await funcion.findAll();
        res.status(200).json(funciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET: Obtener un funcion por ID
const getFuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcion = await funcion.findByPk(id);

        if (!funcion) {
            return res.status(404).json({ message: `función con el id: ${id} no encontrado` });
        }

        res.status(200).json(funcion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// POST: Crear un nuevo funcion
const createFuncion = async (req, res) => {
    try {
        const data = req.body;
        /*
        if (!data.nombre || !data.ubicacion || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, ubicacion o DVH)"
            });
        }*/

        let extra = "";
        if ("id_funcion" in data) {
            extra = " Alerta: El campo id_funcion no es modificable, se estableció otro";
        }

        const nuevoFuncion = await funcion.create({
            nombre: data.nombre,
            ubicacion: data.ubicacion,
            DVH: data.DVH
        });

        res.status(200).json({ message: "Se ha creado el función correctamente." + extra, funcion: nuevofuncion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// PATCH: Modificar parcialmente un funcion en base a su ID
const modifyFuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};


        if ("id_sala" in data) {
            datosCambiar.id_sala = data.id_sala;
        }
        if ("id_pelicula" in data) {
            datosCambiar.id_pelicula = data.id_pelicula;
        }
        if ("id_tecnologia" in data) {
            datosCambiar.id_tecnologia = data.id_tecnologia;
        }
        if ("idioma" in data) {
            datosCambiar.idioma = data.idioma;
        }
        if ("proyeccion" in data) {
            datosCambiar.proyeccion = data.proyeccion;
        }
        if ("horarioInicio" in data) {
            datosCambiar.horarioInicio = data.horarioInicio;
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        const [filasModificadas] = await Funcion.update(datosCambiar, { where: { id_funcion: id } });

        if (filasModificadas === 0) {
            return res.status(404).json({ message: `funcion con el id: ${id} no encontrado` });
        }

        res.status(200).json({ message: "El funcion ha sido modificado correctamente, datos modificados: " + Object.keys(datosCambiar) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// DELETE: Eliminar el registro de un funcion en base a su ID
const deletefuncionById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionesEliminadas = await Funcion.destroy({ where: { id_funcion: id } });

        if (funcionesEliminadas === 0) {
            return res.status(400).json({ message: "No se ha encontrado el funcion, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el funcion de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    getFunciones,
    getFuncionById,
    createFuncion,
    modifyFuncionById,
    deletefuncionById,
}