//const mysql = require('mysql2/promise');
const express = require("express"); // Framework para hacer servidores web y administrar peticiones
const { sequelize, crearBDSiNoExiste } = require('./config/db.js'); // Importamos el sequelize, el cual ya fue importado dentro de config/db.js

// TABLAS
const { Usuario, Rol, Patente, Pelicula, Sala, Funcion, Cine, Tecnologia, Sorteo, Asiento, Transaccion, CompraTicket, Proyeccion } = require('./models/index.js');
const { recalcularTodo } = require('./services/integridad__Service.js');

// CORS
const cors = require ("cors")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const path = require('path')
const server = express();

const cron = require('node-cron');
const { limpiarCodigosVencidos } = require('./controllers/code__controller.js');

// ==========================================
// MIDDLEWARES : express.json, cookies, cors
// ==========================================

server.use('/posters', express.static(path.join(__dirname, './media/posters')))
server.use('/sorteosimg', express.static(path.join(__dirname, './media/sorteos'), { redirect: false }))
server.use(express.json()); // Lenguaje utilizado para enviar y recibir la información
server.use(cookieParser())

//server.use(cors());
// Config del cors (copiado y pegado de un ejercicio del profe)
server.use((req, res, next) => {
  // 👇 Acá decís qué origen tiene permiso
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  // 👇 Métodos HTTP permitidos
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
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


const routes = require("./routes/index.js");
server.use(routes);

cron.schedule('0 * * * *', limpiarCodigosVencidos);

server.listen(3000, async () => {
  try {
    await crearBDSiNoExiste();
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
    // console.log("hash de prueba:", await bcrypt.hash("123", 10));

    // EL MEGA ADMIN: SANTIAGO PALACIOS
    const [Santiago] = await Usuario.findOrCreate({
      where: { email: 'asd@a.com' },
      defaults: {
        nombre: 'Santiago',
        apellido: 'Palacios',
        fechaNacimiento: '2010-10-10',
        alias: 'Santi',
        DNI: 1,
        telefono: 666,
        email: 'asd@a.com',
        contraseña: await bcrypt.hash('123', 10),
        foto: ""
      }
      
    });
    const [Polo] = await Usuario.findOrCreate({
      where: { email: 'asd@aa.com' },
      defaults: {
        nombre: 'Polo',
        apellido: 'Rivera',
        fechaNacimiento: '2010-10-10',
        telefono: 666,
        email: 'asd@aa.com',
        contraseña: await bcrypt.hash('123', 10),
        foto: ""
      }
      
    });

    // ---------- LISTA CON TODAS LAS PATENTES DEL SISTEMA ----------
    const patentes_lista = [
    // Administrador
      'ADMIN_HOME', 'ADMIN_SQL',
      
    // Registros de tablas normales ()
      'GET_REGISTERS',
      'GET_REGISTERS_BY_ID', 'POST_REGISTER',
      'PATCH_REGISTER', 'DELETE_REGISTER',
      'POST_USER_TEST', 'GET_REGISTER_BY_ID'
    ];
    const patentes = {};
    for (const nombre of patentes_lista) {
      const [p] = await Patente.findOrCreate({ where: { nombre } }); // p es el objeto, tanto si existia de antes o si acaba de ser creado
      patentes[nombre] = p; // Lo guardamos en una 2da lista pq necesitamos el objeto, no el string del nombre
    }
    // patentes va a ser la lista de donde vamos a sacar las patentes para asignarlas, uso "patentes" y no "patentes_lista" por lo que dije arriba, para usar el setPatentes() necesito el objeto de la patente, no el string del nombre

    // ---------- CREACION DE ROLES Y ASIGNACIÓN DE PATENTES ----------
    const [adminRole] = await Rol.findOrCreate({
      where: { nombre: 'Admin' },
      defaults: { nombre: 'Admin' }
    });

    const [SemiAdminRole] = await Rol.findOrCreate({
      where: { nombre: 'SemiAdmin' },
      defaults: { nombre: 'SemiAdmin' }
    });

    const [userRole] = await Rol.findOrCreate({
      where: { nombre: 'Usuario' },
      defaults: { nombre: 'Usuario' }
    });



    // El admin tiene todas las patentes
    await adminRole.setPatentes(Object.values(patentes));

    await SemiAdminRole.setPatentes([
      patentes.ADMIN_HOME,
    ])


    // ---------- ASIGNACIÓN DE ROLES Y/O PATENTES A LOS USUARIOS ----------

    await Santiago.setRol(adminRole);
    await Polo.setRol(SemiAdminRole);



    const peliculas = [
        { genero: 'Suspenso', titulo:"Whalefall" , origen: 'EEUU', director: 'Brian Duffield', calificacion: 7, imagen: 'http://localhost:3000/posters/poster-movie-1.jpg',                duracion: '01:46:00' },
        { genero: 'Terror',   titulo:"Madre Siniestra" , origen: 'EEUU', director: 'Rob Savage', calificacion: 6, imagen: 'http://localhost:3000/posters/poster-movie-2.webp',         duracion: '01:33:00' },
        { genero: 'Accion',   titulo:"Street Fighter" , origen: 'EEUU', director: 'Kitao Sakurai', calificacion: 6, imagen: 'http://localhost:3000/posters/poster-movie-3.webp', duracion: '02:05:00' },
        { genero: 'Suspenso', titulo:"Verity" , origen: 'EEUU', director: 'Michael Showalter', calificacion: 7, imagen: 'http://localhost:3000/posters/poster-movie-4.jpg', duracion: '01:50:00' },
        { genero: 'Comedia',  titulo:"Coyote vs Acme" , origen: 'EEUU', director: 'Dave Green', calificacion: 7, imagen: 'http://localhost:3000/posters/poster-movie-5.webp', duracion: '01:30:00' },
        { genero: 'Terror',   titulo:"Resident Evil: Noche Cero" , origen: 'EEUU', director: 'Zach Cregger', calificacion: 6, imagen: 'http://localhost:3000/posters/poster-movie-6.jpg', duracion: '01:45:00' },
        { genero: 'Aventura', titulo:"El Corazón de la Bestia" , origen: 'EEUU', director: 'David Ayer', calificacion: 8, imagen: 'http://localhost:3000/posters/poster-movie-7.jpg',  duracion: '01:41:00' },
        { genero: 'Aventura', titulo:"La odisea" , origen: 'EEUU', director: 'Christopher Nolan', calificacion: 8, imagen: 'http://localhost:3000/posters/poster-movie-8.webp', duracion: '02:30:00' },
        { genero: 'Comedia',  titulo:"Quiero Tu Sexo" , origen: 'EEUU', director: 'Gregg Araki', calificacion: 5, imagen: 'http://localhost:3000/posters/poster-movie-9.jpg', duracion: '01:30:00' },
        { genero: 'Drama',    titulo:"La Casa" , origen: 'Espana',  director: 'Alex Montoya', calificacion: 7, imagen: 'http://localhost:3000/posters/poster-movie-10.jpg', duracion: '01:38:00' },
    ]
    async function insertPeliculas() {
        try {
            for (const peliData of peliculas) {
                await Pelicula.findOrCreate({
                    where: { titulo: peliData.titulo },
                    defaults: peliData
                });
            }
            console.log('--- 10 películas insertadas')
        } catch (err) {
            console.error(err)
        }
    }

    insertPeliculas()

    const sorteos = [
      { id_Pelicula: 3, nombre: "Ready, watch!", infoGral: 'Para los fans mas acerrimos de la franquicia, mira la peli y gana grandes premios!', premio: {premio1: 'Vaso Ryu', premio2: 'Pochoclera Street Fighter'} },
      { id_Pelicula: 6, nombre: "De vuelta a Racoon City", infoGral: 'Adentrate en los misterios de Resident Evil: Noche Cero ', premio: {premio1: 'Vaso Resident Evil: Noche Cero', premio2: 'Pochoclera Resident Evil: Noche Cero', premio3: 'Resident Evil Requiem para Steam'} },
    ]

    async function insertSorteos() {
      try{
        for (const sorteoInfo of sorteos){
          await Sorteo.findOrCreate({
            where: {nombre: sorteoInfo.nombre},
            defaults: sorteoInfo
          });
        }
        console.log('--- 2 sorteos insertados')
      }
      catch(err){
        console.log(err)
      }
    }

    insertSorteos()

    // ==========================================
    // 4. CINES Y SALAS
    // ==========================================
    const [cinePrueba] = await Cine.findOrCreate({
        where: { nombre: 'Mega Cine' },
        defaults: { 
            nombre: 'Mega Cine', 
            ubicacion: 'Centro 1', 
            DVH: "ABC123" 
        }
    });

    const salas = [
        { id_Cine: cinePrueba.id_Cine, numero: 1, filas: 27, columnas: 15, DVH: "ABC123" },
        { id_Cine: cinePrueba.id_Cine, numero: 2, filas: 27, columnas: 16, DVH: "ABC123" },
        { id_Cine: cinePrueba.id_Cine, numero: 3, filas: 17, columnas: 26, DVH: "ABC123" },
    ];

    for (const salaData of salas) {
        await Sala.findOrCreate({
            where: { id_Cine: salaData.id_Cine, numero: salaData.numero },
            defaults: salaData
        });
    }
    console.log('--- Salas insertadas correctamente');

    // ==========================================
    // 5. TECNOLOGÍA Y FUNCIONES
    // ==========================================
    const [tecnologiaPrueba] = await Tecnologia.findOrCreate({
        where: { nombre: '2D Estándar' },
        defaults: { 
            nombre: '2D Estándar', 
            descripcion: 'Proyección digital', 
            DVH: "ABC123" 
        }
    });

    const proyeccion2d = await Proyeccion.create(
        {
            formato: "2D"
        }
    )
    const proyeccion3d = await Proyeccion.create(
        {
            formato: "3D"
        }
    )
    
    const funciones = [
        { id_Sala: 1, id_Pelicula: 1, id_Tecnologia: tecnologiaPrueba.id_Tecnologia, idioma: 'Español', id_Proyeccion: proyeccion2d.id_Proyeccion, horarioInicio: new Date('2026-06-15T18:00:00'), precio: 2400, DVH: "ABC123" },
        { id_Sala: 2, id_Pelicula: 1, id_Tecnologia: tecnologiaPrueba.id_Tecnologia, idioma: 'Subtitulad', id_Proyeccion: proyeccion3d.id_Proyeccion, horarioInicio: new Date('2026-06-15T21:30:00'), precio: 4000, DVH: "ABC123" },
        { id_Sala: 3, id_Pelicula: 1, id_Tecnologia: tecnologiaPrueba.id_Tecnologia, idioma: 'Español', id_Proyeccion: proyeccion2d.id_Proyeccion, horarioInicio: new Date('2026-06-16T19:00:00'), precio: 4500, DVH: "ABC123" },
    ];

    for (const funcionData of funciones) {
        await Funcion.findOrCreate({
            where: { 
                id_Sala: funcionData.id_Sala, 
                horarioInicio: funcionData.horarioInicio 
            },
            defaults: funcionData
        });
    }
    console.log('--- Funciones insertadas correctamente');

    const asientos = [
        { id_Funcion: 1, columna: 1, fila: 100, DVH: "ABC123" },
        { id_Funcion: 1, columna: 2, fila: 100, DVH: "ABC123" },
        { id_Funcion: 1, columna: 3, fila: 100, DVH: "ABC123" },
    ];

    for (const asiento of asientos) {
        await Asiento.create(
            asiento
        );
        console.log('--- Asientos insertados correctamente');
    }



  

    await insertDatosCompletos();
    await recalcularTodo();
    console.log('DVH y DVV recalculados');

  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', {error});
  }
});

const insertDatosCompletos = async () => {
  try {
      // 1. Cine
      const cines = [
          { nombre: "Hoyts Abasto", ubicacion: "Av Corrientes 3247", DVH: "CIN001" },
          { nombre: "Village Recolet", ubicacion: "Vicente Lopez 2050", DVH: "CIN002" }
      ];
      for (const cine of cines) {
          await Cine.findOrCreate({
              where: { nombre: cine.nombre },
              defaults: cine
          });
      }
      console.log('1/7 Cines insertados');




      // 2. Tecnologia
      const tecnologias = [
          { nombre: "IMAX 3D", descripcion: "Pantalla gigante", DVH: "TEC001" },
          { nombre: "2D Standard", descripcion: "Proyección clásica", DVH: "TEC002" }
      ];
      for (const tecno of tecnologias) {
          await Tecnologia.findOrCreate({
              where: { nombre: tecno.nombre },
              defaults: tecno
          });
      }
      console.log('2/7 Tecnologías insertadas');




      // 3. Sala
      const salas = [
          { id_Cine: 1, numero: 1, filas: 10, columnas: 30, DVH: "SAL001" },
          { id_Cine: 1, numero: 2, filas: 20, columnas: 30, DVH: "SAL002" }
      ];
      for (const sala of salas) {
          await Sala.findOrCreate({
              where: { id_Cine: sala.id_Cine, numero: sala.numero },
              defaults: sala
          });
      }
      console.log('3/7 Salas insertadas');




      // 4. Funcion (Corregido: cargamos todas las FKs necesarias)
      const funciones = [
          {
              id_Sala: 1,
              id_Pelicula: 3,
              id_Tecnologia: 1,
              idioma: "Subtitulado",
              id_Proyeccion: 1,
              horarioInicio: new Date("2026-11-10T18:30:00"),
              precio: 1000,
              DVH: "FUN001"
          },
          {
              id_Sala: 2,
              id_Pelicula: 6,
              id_Tecnologia: 2,
              idioma: "Español",
              id_Proyeccion: 2,
              horarioInicio: new Date("2026-11-10T21:00:00"),
              precio: 2000,
              DVH: "FUN002"
          }
      ];
      for (const funcion of funciones) {
          await Funcion.findOrCreate({
              where: {
                  id_Sala: funcion.id_Sala,
                  horarioInicio: funcion.horarioInicio
              },
              defaults: funcion
          });
      }
      console.log('4/7 Funciones insertadas');

      // 6. Transaccion
      const Transacciones = [
          {
              id_Usuario: 1,
              total: 5000,
              fechaDeEmision: new Date(),
              metodoDePago: "MercadoPago",
              DVH: "TRX001"
          }
      ];
      await Transaccion.create({
          id_Usuario: 1,
          total: 5000,
          fechaDeEmision: new Date(),
          metodoDePago: "MercadoPago",
          DVH: "TRX001"
      });  
      console.log('6/7 Transacciones insertadas');




      // 7. CompraTicket
      const tickets = [
          {
              id_Transaccion: 1,
              id_Asiento: 1,
              precio: 2500,
              DVH: "TCK001"
          }
      ];
      for (const ticket of tickets) {
          await CompraTicket.findOrCreate({
              where: {
                  id_Transaccion: ticket.id_Transaccion,
                  id_Asiento: ticket.id_Asiento
              },
              defaults: ticket
          });
      }
      console.log('7/7 CompraTickets insertados');




      console.log('¡Carga de los 7 modelos ejecutada completamente con éxito!');
  } catch (err) {
      console.error('Error durante la inserción:', err);
  }
};








//documentacion: https://sequelize.org/