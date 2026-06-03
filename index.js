const express = require("express"); // Framework para hacer servidores web y administrar peticiones
const { sequelize } = require('./config/db.js'); // Importamos el sequelize, el cual ya fue importado dentro de config/db.js
require('./models/index.js'); // Se importan todas las estructuras de las tablas
const userRoutes = require('./routes/userRoutes.js'); // Se importan todas las rutas de user
const hobbyRoutes = require('./routes/hobbyRoutes.js'); // Se importan todas las rutas de hobby

const server = express();
server.use(express.json()); // Lenguaje utilizado para enviar y recibir la información

server.get('/', (req, res) => {
    res.status(200).json({ message: "🔥🔥🔥 HOLAAAAA 🔥🔥🔥" });
});


server.use('/users', userRoutes);
server.use('/hobbies', hobbyRoutes);



server.listen(3000, async () => {
  try {
    await sequelize.authenticate(); // Prueba para verificar que haya conexión exitosa y ver si el motor de la BD está encendido
    await sequelize.sync({ force: false }); // Verifica las estructuras de la BD, comparando lo ingresado en el JS con lo que está en la BD
    /* INTERACCIÓN CON LAS TABLAS:
        sync() : Crea tablas (SNE), no modifica ni borra
        sync(force: true): Recrea absolutamente toda la BD, creando, modificando o borrando tablas
        sync(alter: true): Crea (SNE) y modifica (SE) tablas pero no borra
    */
    console.log("El servidor está ON en el puerto 3000 y la BD lista");
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});

//documentacion: https://sequelize.org/