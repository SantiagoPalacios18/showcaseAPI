const express = require("express"); // Framework para hacer servidores web y administrar peticiones
const { Sequelize, DataTypes, Model } = require("sequelize"); // Librería que nos permite interactuar con bases de datos mediante JS o TS

const server = express();
server.use(express.json());

const sequelize = new Sequelize('test' /* nombre DB */, 'root' /* nombre de mi usuario */, '' /* password de mi usuaro */, {
host: 'localhost',
dialect: 'mysql',
logging: false // NO muestra todo lo que se hace en la base de datos
});


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false // Evita buscar createdAt y updatedAt
});

// MODELO DE HOBBIES

const Hobby = sequelize.define('Hobby', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'hobbies',
  timestamps: false
});

// 3. CONFIGURACIÓN DE LA RELACIÓN MUCHOS A MUCHOS
// Esto le dice a Sequelize que use la tabla 'user_hobbies' que ya creaste en phpMyAdmin

User.belongsToMany(Hobby, {
  through: 'user_hobbies', // Nomb de la tabla intermedia
  foreignKey: 'user_id', // FK que apunta a User
  otherKey: 'hobby_id', // Fk que apunta a Hobby
  timestamps: false
});

Hobby.belongsToMany(User, {
  through: 'user_hobbies',
  foreignKey: 'hobby_id', // FK que apunta a Hobby
  otherKey: 'user_id', // FK que apunta a User
  timestamps: false
});

/* -------------------- Endpoints de la API -------------------- */
server.get('/', (req, res) => {
    res.status(200).json({ message: "HOLAAAAA" });
});


// GET - Obtener todos los usuarios
server.get('/users', async (req, res) => {
    try {

        const users = await User.findAll({
            include:{ // Nivel de tabla hobbies
                model: Hobby,
                attributes : ["name"],
                through : { // Nivel de tabla intermedia, por ahora no tengo nada asiq no la uso
                    attributes: []
                }
            }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener un usuario por ID
server.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include:{ // Nivel de tabla hobbies
                model: Hobby,
                attributes : ["name"],
                through : { // Nivel de tabla intermedia, por ahora no tengo nada asiq no la uso
                    attributes: []
                }
            }
            
        });

        if (!user) {
        return res.status(404).json({ message: `Usuario con el id: ${id} no encontrado` });
        }

        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Obtener todos los usuarios que tienen nombre X
server.get('/nombre/:name', async (req, res) => {
    try {
        const nameUsers = await User.findAll({
        where: { nombre: req.params.name}
        })
        res.status(200).json(nameUsers)
    } catch (error) {
        res.status(500).json(error)
    }
})
//findByPk, findOne, findAll, create, destroy,

// GET - Obtener usuario con sus hobbies
server.get('/users/:id/hobbies', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: Hobby // Aquí ocurre el Eager Loading
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST - Crear nuevo usuario
server.post('/create-user', async (req, res) =>{
    try{
        let data = req.body
        User.create({firstname: data.firstname, lastname : data.lastname, isActive : data.isActive, age : data.age})
        extra = ""
        if ( "id" in data){
            extra = " Alerta: El campo ID no es modificable, se estableció otro"
        }
        res.status(200).json("Se ha creado al usuario correctamente." + extra);
    } catch(error){
        res.status(500).json({ error: error.message });
    }


})
// PUT - Modificar todo un usario en base a su ID
server.put("/:id", async(req,res) =>{
    const {id} = req.params
    try{
        let data = req.body
        User.update({firstname: data.firstname, lastname : data.lastname, isActive : data.isActive, age : data.age}, {where: {id: id}})
        res.status(200).json("El usuario ha sido restablecido correctamente")
    }catch(error){
        res.status(404).json({error: error.message})
    }
})


// PATCH - Modificar parcialmente a un usuario en base a su ID
server.patch("/:id", async(req,res) =>{
    try{
        const {id} = req.params
        const data = req.body
        let datosCambiar = {}
        if ("firstname" in data){
            datosCambiar.firstname =  data.firstname
        }
        if ("lastname" in data){
            datosCambiar.lastname = data.lastname
        }
        if ("isActive" in data){
            datosCambiar.isActive = data.isActive
        }
        if ("age" in data){
            datosCambiar.age = data.age
        }
        if (Object.keys(datosCambiar).length == 0){
            return( res.status(400).json("No se ha encontrado ningun dato para modificar"))
        }
        await User.update(datosCambiar, {where : {id : id}})
        res.status(200).json("El usuario ha sido restablecido correctamente, datos modificados: " + Object.keys(datosCambiar))
    }catch(error){
        res.status(404).json({error: error.message})
    }
})

// DELETE - Borrar el registro de un usuario en base a su ID
server.delete("/:id", async (req,res) =>{
    const {id} = req.params
    try{
        const UModificados = await User.destroy( {where: {id: id}})
        if (UModificados === 0){
            return res.status(400).json("No se ha encontrado al usuario, 0 modificaciones realizadas")
        }
        res.status(200).json("Se ha eliminado correctamente al usuario de ID: " + id)

    }catch(error){
        res.status(404).json({error: error.message})
    }
})



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