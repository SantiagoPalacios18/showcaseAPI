//const mysql = require('mysql2/promise');
const express = require("express"); // Framework para hacer servidores web y administrar peticiones
const { sequelize } = require('./config/db.js'); // Importamos el sequelize, el cual ya fue importado dentro de config/db.js

// TABLAS
const { Usuario, Rol, Patente, Pelicula } = require('./models/index.js');

// CORS
const cors = require ("cors")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")

const server = express();

// ==========================================
// MIDDLEWARES : express.json, cookies, cors
// ==========================================

server.use(express.json()); // Lenguaje utilizado para enviar y recibir la información
server.use(cookieParser())


//server.use(cors());
// Config del cors (copiado y pegado de un ejercicio del profe)
server.use((req, res, next) => {
  // 👇 Acá decís qué origen tiene permiso
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  // 👇 Métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  // 👇 Qué headers puede mandar el frontend
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // 👇 Si querés permitir cookies/tokens en las peticiones
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  // Si es una petición OPTIONS (preflight), respondemos rápido
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})


server.get('/', (req, res) => {
    res.status(200).json({ message: "🔥🔥🔥 HOLAAAAA 🔥🔥🔥" });
});

server.get('/tables/getAllTables',async (req,res)=>{
    const tablas = await sequelize.getQueryInterface().showAllTables();
    res.status(200).json(tablas)
    console.log(tablas)
})


const routes = require("./routes/index.js");
server.use(routes);







server.listen(3000, async () => {
  try {
    await sequelize.authenticate(); // Prueba para verificar que haya conexión exitosa y ver si el motor de la BD está encendido
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await sequelize.sync({ force: true }); // Verifica las estructuras de la BD, comparando lo ingresado en el JS con lo que está en la BD
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;'); // Esto lo meto para poder modificar tablas y que no tire errores por relaciones, luego se deberia poder sacar sin problema
    /* INTERACCIÓN CON LAS TABLAS: (SE: Si Existe, SNE: Si No Existe)
        sync() : Crea tablas (SNE), no modifica ni borra
        sync(force: true): Recrea absolutamente toda la BD, creando, modificando o borrando tablas
        sync(alter: true): Crea (SNE) y modifica (SE) tablas pero no borra
    */
    console.log("El servidor está ON en el puerto 3000 y la BD lista");
    console.log("hash de prueba:", await bcrypt.hash("123", 10));

    // EL MEGA ADMIN: BENITO CAMELA
    const [Benito] = await Usuario.findOrCreate({
      where: { email: 'asd@a.com' },
      defaults: {
        nombre: 'Benito',
        apellido: 'Camela',
        edad: '999',
        DNI: 1,
        telefono: 666,
        email: 'asd@a.com',
        contraseña: await bcrypt.hash('123', 10),
        foto: "sas"
      }
      
    });

    // Creación de roles y patentes

    const [adminRole] = await Rol.findOrCreate({
      where: { nombre: 'Admin' },
      defaults: { nombre: 'Admin' }
    });
    const [userRole] = await Rol.findOrCreate({
      where: { nombre: 'Usuario' },
      defaults: { nombre: 'Usuario' }
    });

    // Revisa cuáles patentes existen y crea las que faltan

    const nombres = ['ADMIN_HOME', 'ADMIN_CREATE'];
    const patentes = [];
    for (const nombre of nombres) {
      const [p] = await Patente.findOrCreate({ where: { nombre } }); // p es el objeto, tanto si existia de antes o si acaba de ser creado
      patentes.push(p); // Lo guardamos en una 2da lista pq necesitamos el objeto, no el string del nombre
    }
    // Todas las patentes de la lista eran para admin
    await adminRole.setPatentes(patentes); // Esto no sirve si le paso strings

    await Benito.setRol(adminRole);

    const peliculas = [
        { genero: 'Suspenso', origen: 'EEUU',    id_Director: 'Brian Duffield',    calificacion: 7, imagen: 'whalefall.jpg',                duracion: '01:46:00' },
        { genero: 'Terror',   origen: 'EEUU',    id_Director: 'Rob Savage',        calificacion: 6, imagen: 'Madre Siniestra.webp',         duracion: '01:33:00' },
        { genero: 'Accion',   origen: 'EEUU',    id_Director: 'Kitao Sakurai',     calificacion: 6, imagen: 'Street Fighter.webp',          duracion: '02:05:00' },
        { genero: 'Suspenso', origen: 'EEUU',    id_Director: 'Michael Showalter', calificacion: 7, imagen: 'Verity.jpg',                   duracion: '01:50:00' },
        { genero: 'Comedia',  origen: 'EEUU',    id_Director: 'Dave Green',        calificacion: 7, imagen: 'Coyote vs Acme.webp',          duracion: '01:30:00' },
        { genero: 'Terror',   origen: 'EEUU',    id_Director: 'Zach Cregger',      calificacion: 6, imagen: 'Resident Evil Noche Cero.jpg', duracion: '01:45:00' },
        { genero: 'Aventura', origen: 'EEUU',    id_Director: 'David Ayer',        calificacion: 8, imagen: 'El corazón de la Bestia.jpg',  duracion: '01:41:00' },
        { genero: 'Aventura', origen: 'EEUU',    id_Director: 'Christopher Nolan', calificacion: 8, imagen: 'La Odisea.webp',               duracion: '02:30:00' },
        { genero: 'Comedia',  origen: 'EEUU',    id_Director: 'Gregg Araki',       calificacion: 5, imagen: 'Quiero tu sexo.jpg',           duracion: '01:30:00' },
        { genero: 'Drama',    origen: 'Espana',  id_Director: 'Alex Montoya',      calificacion: 7, imagen: 'La casa.jpg',                  duracion: '01:38:00' },
    ]
    async function insertPeliculas() {
        try {
            await Pelicula.bulkCreate(peliculas)
            console.log('10 películas insertadas')
        } catch (err) {
            console.error(err)
        }
    }

    insertPeliculas()






  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});
/*
 (async(req,res) => {
  let Benito = await Usuario.findOne({where:{email: 'asd@a.com'}})
  if (!Benito){
    const hash = await bcrypt.hash('123456', 10)
    Benito = await Usuario.create({
      nombre: 'Benito',
      apellido: 'Camela',
      edad: '999',
      DNI: null,
      telefono: null,
      email: 'asd@a.com',
      contraseña: hash
    })
  }

})()
*/

//documentacion: https://sequelize.org/