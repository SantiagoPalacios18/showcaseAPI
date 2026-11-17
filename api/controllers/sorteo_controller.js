const { Sorteo } = require('../models/index.js');
const crypto = require("crypto");
const { Usuario_sorteo } = require('../models/index.js');
const { Op } = require('sequelize');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');




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

        if(!req.file){
            return res.status(400).json({error: 'No se subio una imagen a cartelera'})
        }

        let extra = "";
        if ("id_sorteo" in req.body) {
            extra = " Alerta: El ID no es modificable, se estableció otro";
        }

        const imagen = req.file

        const oldPath = imagen.path

        const nuevoSorteo = await Sorteo.create(req.body);

        const newName = `sorteo-img-${nuevoSorteo.id_sorteo}${path.extname(imagen.originalname)}`

        const newPath = path.join('./media/sorteos/', newName)

        fs.renameSync(oldPath, newPath)

        const baseUrl = `${req.protocol}://${req.get('host')}`
        const sorteoFinal = await nuevoSorteo.update({imagen: `${baseUrl}/sorteos/${newName}`})

        res.status(201).json({
            message: "Se ha creado el sorteo correctamente." + extra,
            sorteo: sorteoFinal
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
                const lista_u = await Usuario_sorteo.findAll({
            });


            if (lista_u.length === 0) {
                return console.log(`No se encontraron clientes para el sorteo: ${sorteo.id_sorteo}` );
                
            }
            const indice = crypto.randomInt(0, lista_u.length);
            const ganador = lista_u[indice]; 
            
             console.log("suerte",ganador.id_Usuario)

            const suerte2 = await Sorteo.update(
                { id_ganador: ganador.id_Usuario },
                { where: { id_sorteo: sorteo.id_sorteo } }
            );

            console.log("porfavor",{suerte2});
            
            console.log("Se eligió un ganador:", ganador)
            //res.status(200).json({ message:"se eligio un ganador"})
        }


    } catch (error) {
        console.log({error})
    }
}

const getBuscarGanador = async (req, res) =>{
    try{
        const { id } = req.params;
        const ganador = await Sorteo.findByPk(id);


        if (!ganador) {
            return res.status(404).json({ message: `no se encontro ganador para el sorteo: ${id}` });
        }


        res.status(200).json(ganador);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

cron.schedule(' 0 * * * *', SorteoTermino);


module.exports = {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById,
    getBuscarGanador
};
