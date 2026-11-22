const { Sorteo } = require('../models/index.js');
const crypto = require("crypto");
const { Usuario_sorteo } = require('../models/index.js');
const { Op } = require('sequelize');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

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

// GET: Obtener todos los sorteos vigentes (hasta 24h después de haber terminado)
const getSorteos = async (req, res) => {
  try {
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const sorteos = await Sorteo.findAll({
      where: {
        fecha_sor: {
          [Op.gt]: haceUnDia, // Solo trae los que NO superaron 1 día desde fecha_sor
        },
      },
    });

    console.log({ sorteos });
    res.status(200).json(sorteos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const SorteoTermino = async () => {
  try {
    const ahora = new Date();

    // 1. Buscar sorteos que ya terminaron y TODAVÍA NO tienen ganador
    const sorteoTerminado = await Sorteo.findAll({
      where: {
        fecha_sor: {
          [Op.lte]: ahora,
        },
        id_ganador: null,
      },
    });

    if (sorteoTerminado.length === 0) {
      console.log("Cron: No se encontraron sorteos nuevos para sortear.");
      return;
    }

    for (const sorteo of sorteoTerminado) {
      console.log(`Ejecutando sorteo: ${sorteo.nombre} (ID: ${sorteo.id_sorteo})`);

      // Ojo: si Usuario_sorteo tiene id_sorteo, podés filtrar: { where: { id_sorteo: sorteo.id_sorteo } }
      const lista_u = await Usuario_sorteo.findAll({});

      if (lista_u.length === 0) {
        console.log(`No se encontraron clientes para el sorteo: ${sorteo.id_sorteo}`);
        continue; // Usamos continue en vez de return para que siga con los demás sorteos del bucle
      }

      const indice = crypto.randomInt(0, lista_u.length);
      const ganador = lista_u[indice];

      console.log("suerte", ganador.id_Usuario);

      const suerte2 = await Sorteo.update(
        { id_ganador: ganador.id_Usuario },
        { where: { id_sorteo: sorteo.id_sorteo } }
      );

      console.log("porfavor", { suerte2 });
      console.log("Se eligió un ganador:", ganador);
    }
  } catch (error) {
    console.log("Error en SorteoTermino:", error);
  }
};

// NUEVA FUNCIÓN: Eliminar sorteos 1 día (24 horas) después de haber terminado
const eliminarSorteosVencidos = async () => {
  try {
    const haceUnDia = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Buscamos los sorteos cuya fecha_sor sea menor o igual a hace 24 horas
    const sorteosParaBorrar = await Sorteo.findAll({
      where: {
        fecha_sor: {
          [Op.lte]: haceUnDia,
        },
      },
    });

    if (sorteosParaBorrar.length === 0) {
      return;
    }

    // 2. Borramos las imágenes físicas asociadas en ./media/sorteos/
    for (const sorteo of sorteosParaBorrar) {
      if (sorteo.imagen) {
        const nombreArchivo = path.basename(sorteo.imagen); // Extrae "sorteo-img-X.ext" de la URL
        const rutaImagen = path.join("./media/sorteos/", nombreArchivo);

        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
          console.log(`Imagen eliminada: ${rutaImagen}`);
        }
      }
    }

    // 3. Eliminamos los registros de la base de datos
    const idsABorrar = sorteosParaBorrar.map((s) => s.id_sorteo);
    const eliminados = await Sorteo.destroy({
      where: {
        id_sorteo: {
          [Op.in]: idsABorrar,
        },
      },
    });

    console.log(`Se eliminaron ${eliminados} sorteos vencidos hace más de 1 día.`);
  } catch (error) {
    console.log("Error en eliminarSorteosVencidos:", error);
  }
};

// Ejecuta cada hora (minuto 0): primero sortea los recién terminados, luego limpia los que ya cumplieron +24h
cron.schedule("0 * * * *", async () => {
  await SorteoTermino();
  await eliminarSorteosVencidos();
});

cron.schedule(' 0 * * * *', SorteoTermino);


module.exports = {
    getSorteos,
    getSorteoById,
    createSorteo,
    modifySorteoById,
    deleteSorteoById,
    eliminarSorteosVencidos,
    getBuscarGanador
};
