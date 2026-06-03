const { User, Hobby } = require('../models/index.js');


// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include:{ // Traemos de una tabla
                model: Hobby, // Tabla especificada: hobby
                attributes : ["name"], // Atributos a sacar: name
                through : { // Nivel de tabla intermedia, esto nos serviria para sacar un campo de esta tabla, por ahora no tengo nada asiq no la uso
                    attributes: []
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// Obtener un usuario por ID

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include:{
                model: Hobby,
                attributes : ["name"],
            }
            
        });

        if (!user) {
        return res.status(404).json({ message: `Usuario con el id: ${id} no encontrado` });
        }

        res.status(200).json(user);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener todos los usuarios que tienen nombre X

const getUsersByName = async (req, res) => {
    try {
        const nameUsers = await User.findAll({
        where: { firstname: req.params.name}
        })
        res.status(200).json(nameUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}
// Obtener usuario con sus hobbies ( podriamos unirlo al getUserById )
const getUsersWithHobbies = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: Hobby
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear nuevo usuario
const createUser = async (req, res) =>{
    try{
        let data = req.body
        User.create({firstname: data.firstname, lastname : data.lastname, isActive : data.isActive, age : data.age})

        if (!data.firstname || !data.lastname || !data.age ) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (nombre, apellido o edad)"
            });
        }
        
        extra = ""
        if ( "id" in data){
            extra = " Alerta: El campo ID no es modificable, se estableció otro"
        }
        res.status(200).json("Se ha creado al usuario correctamente." + extra);
    } catch(error){
        res.status(500).json({ error: error.message });
    }


}

// Modificar todo un usario en base a su ID
const putUserbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const { firstname, lastname, isActive, age } = req.body;

        if (!firstname || !lastname || isActive === undefined || !age) {
            return res.status(400).json({ message: "Faltan datos obligatorios, PUT requiere todos los campos" });
        }

        await User.update(
            { firstname, lastname, isActive, age },
            { where: { id } }
        );

        res.status(200).json("El usuario ha sido restablecido correctamente");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Modificar parcialmente a un usuario en base a su ID
const modifyUsersById = async(req,res) =>{
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
}
// Borrar el registro de un usuario en base a su ID
const deleteUserById = async (req,res) =>{
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
}

module.exports = {
    getUsers,
    getUserById,
    getUsersByName,
    getUsersWithHobbies,
    createUser,
    putUserbyId,
    modifyUsersById,
    deleteUserById,
}