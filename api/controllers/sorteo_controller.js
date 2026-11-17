const { Sorteo } = require('../models/index.js');
const crypto = require("crypto");
const { Usuario_sorteo } = require('../models/index.js');
const { Op } = require('sequelize');
const cron = require('node-cron');




// GET: Obtener todos los sorteos
const getSorteos = async (req, res) => {
    try {
        const sorteos = await Sorteo.findAll();
        console.log({sorteos})
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

        if (!data.descripcion || !data.fecha_inicio || !data.fecha_fin) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (descripcion, fecha_inicio, fecha_fin)"
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


const SorteoTermino = async ()=> {
    try {
        const ahora = new Date()


        const sorteoTerminado= await Sorteo.findAll({
            where: {
                fecha_sor:{
                    [Op.lte]: ahora
                }
            }
        })
        if (sorteoTerminado.length === 0 ) {
            return  res.status(400).json({ message: "No se han encontrado sorteos para activar" });
        }
       
        for (const sorteo of sorteoTerminado) {
            console.log(`Ejecutando sorteo: ${sorteo.nombre} (ID: ${sorteo.id_sorteo})`);
            await ElegirGanador(sorteo.id_sorteo)
        }


    } catch (error) {
        console.log({error})
    }
}




const ElegirGanador = async (req, res) => {
    try {
        const lista_u = await Usuario_sorteo.findAll({
        });


        if (lista_u.length === 0) {
            return res.status(404).json({ message: `No se encontraron clientes para el sorteo: ${id_sorteo}` });
        }
        const indice = crypto.randomInt(0, lista_u.length);
        const ganador = lista_u[indice];
        console.log({ ganador });  

        console.log("Se eligió un ganador:", ganador)
        //res.status(200).json({ message:"se eligio un ganador"})
    }
    catch (error) {
        console.log(error)
    }
}


cron.schedule(' 0 * * * *', SorteoTermino);


module.exports = {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById,
    getElegirGanador
};
