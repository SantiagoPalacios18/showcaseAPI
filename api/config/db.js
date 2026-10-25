const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('showcase' /* nombre DB */, 'root' /* nombre de mi usuario */, '1234' /* password de mi usuaro */, {
    host: 'localhost',
    dialect: 'mysql',
    root: 3306,
    logging: false // NO muestra todo lo que se hace en la base de datos
});

module.exports = { sequelize};