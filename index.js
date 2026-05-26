const express = require("express")
const mysql = require("mysql2")
const server = express()
server.use(express.json())


const connection = mysql.createConnection({
host: 'localhost',
user: 'root', // El nuevo usuario
password: '',
database: 'marquitos'
});


/*
CREATE DATABASE mi_proyecto;
USE mi_proyecto;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
fecha_nacimiento DATE NOT NULL
);

INSERT INTO users (nombre, apellido, fecha_nacimiento)
VALUES ('Alan', 'Turing', '1912-06-23');

*/

// connection.connect(function(err) {
// if (err) {
// console.error('error connecting: ' + err.stack);
// return;
// }

// console.log('connected as id ' + connection.threadId);
// });


server.get('/users', (req, res) => {
const query = 'SELECT * FROM users';
// `SELECT * FROM users where id = ${req.params.id}`
connection.query(query, (error, results) => {
if (error) {
return res.status(500).json({ error: error });
}

res.status(200).json(results);
});
})


server.get('/users/:tabla/:id', (req, res) => {
const query = `SELECT * FROM ${req.params.tabla} WHERE id=${req.params.id}`

connection.query(query, (err, results) => {
if (err) return res.status(500).json({ error: err })

if (results.length === 0) return res.status(404).json({ message: `Registro con el id: ${req.params.id} no enontrado` })

res.status(200).json(results[0])
})
})

server.post('/users/:tabla', (req, res) => {
    if(req.params.tabla === "users"){
        const query = `INSERT INTO users (firstname, lastname, fec_nac) VALUES (${req.body.firstname}, ${req.body.lastname}, ${req.body.fec_nac})`
    }else if(req.params.tabla === "hobbis"){
        const query = `INSERT INTO users (hobby_name) VALUES (${req.body.hobby_name})`
    }else if(req.params.tabla === "users_hobbis"){
        const query = `INSERT INTO users (id_user, id_hobby) VALUES (${req.body.id_user}, ${req.body.id_hobby})`
    }
    connection.query(query, (err, results) =>{
        if (err) return res.status(500).json({ error: err })
        
        if (results.length === 0) return res.status(404).json({ message: `Registro con el id: ${req.params.id} no enontrado` })

        res.status(200).json(results[0])
    })
})



server.get('/', (req, res) => {
res.status(200).json({
message: "El server funciona"
})
})



server.listen(3000, () => {
console.log("El servidor esta ON");
})