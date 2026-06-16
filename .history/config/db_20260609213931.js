const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('test' /* nombre DB */, 'root' /* nombre de mi usuario */, '' /* password de mi usuaro */, {
    host: 'localhost',
    dialect: 'mysql',
    root: 3307,
    logging: false // NO muestra todo lo que se hace en la base de dato
});

module.exports = { sequelize };