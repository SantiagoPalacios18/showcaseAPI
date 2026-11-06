const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');



const DB_NAME = 'showcase';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_HOST = 'localhost';


const sequelize = new Sequelize(DB_NAME /* nombre DB */, DB_USER /* nombre de mi usuario */, DB_PASSWORD /* password de mi usuaro */, {
    host: DB_HOST,
    dialect: 'mysql',
    root: 3306,
    logging: false // NO muestra todo lo que se hace en la base de datos
});

async function crearBDSiNoExiste() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  });
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  await connection.end();
}


module.exports = { sequelize, crearBDSiNoExiste };