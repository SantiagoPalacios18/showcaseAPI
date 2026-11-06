const { Usuario, Transaccion, CompraTicket, Asiento, Funcion, Pelicula } = require('../models/index.js');
const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const {default_foto} = require('../SRC/default-foto.js')

// Obtener todos los useres
const getUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            attributes:{
                exclude: ["contraseña", "foto"]
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
        const user = await Usuario.findByPk(id, {
            attributes:{
                exclude: ["contraseña", "foto"]

            }
        });

        if (!user) {
            return res.status(404).json({ message: `usuario con el id: ${id} no encontrado` });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_Rol || !data.nombre || !data.apellido || !data.DNI || !data.telefono || !data.email || !data.fechaNacimiento || !data.DVH) {
            return res.status(400).json({
                message: "Faltan datos obligatorios (id_Rol, nombre, apellido, DNI, telefono, email, fechaNacimiento DVH)"
            });
        }
        let extra = "";
        if ("id_Usuario" in data) {
            extra = " Alerta: El campo id_Usuario no es modificable, se estableció otro";
        }

        const nacimiento = new Date(data.fechaNacimiento)
        //const edad = (Date.now() - nacimiento) / (1000 * 60 * 60 * 24 * 365.25)
        if ( nacimiento > new Date()) {
            return res.status(400).json({ message: "Fecha de nacimiento inválida" })
        }
        const nuevouser = await Usuario.create({
            id_Rol: data.id_Rol,
            nombre: data.nombre,
            apellido: data.apellido,
            DNI: data.DNI,
            fechaNacimiento: data.fechaNacimiento,
            telefono: data.telefono,
            email: data.email,
            foto: default_foto,
            DVH: data.DVH,
            contraseña: await bcrypt.hash(data.contraseña, 10),
        });

        res.status(200).json({ message: "Se ha creado el user correctamente." + extra, user: nuevouser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



// Modificar parcialmente un user en base a su ID
const modifyuserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        let datosCambiar = {};


        if ("nombre" in data) {
            datosCambiar.nombre = data.nombre;
        }
        if ("apellido" in data) {
            datosCambiar.apellido = data.apellido;
        }
        if ("DNI" in data) {
            datosCambiar.DNI = data.DNI;
        }
        if ("telefono" in data) {
            datosCambiar.telefono = data.telefono;
        }
        if ("email" in data) {
            datosCambiar.email = data.email;
        }
        if ("foto" in data) {
            datosCambiar.foto = data.foto;
        }
        const user = await Usuario.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `user con el id: ${id} no encontrado` });
        }

        if (Object.keys(datosCambiar).length === 0) {
            return res.status(400).json({ message: "No se ha encontrado ningún dato para modificar" });
        }

        await user.update(datosCambiar);


        res.status(200).json({ message: "El user ha sido modificado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Eliminar el registro de un user en base a su ID
const deleteuserById = async (req, res) => {
    try {
        const { id } = req.params;
        const useresEliminados = await userBD.destroy({ where: { id_Usuario: id } });

        if (useresEliminados === 0) {
            return res.status(400).json({ message: "No se ha encontrado el usuario, 0 eliminaciones realizadas" });
        }

        res.status(200).json({ message: "Se ha eliminado correctamente el user de ID: " + id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createTestUser = async (req, res) => {
    try {

        
        const existentes = await Usuario.findAll({
            where: { email: { [Op.like]: "test%@a.com" } },
            attributes: ["email"]
        });
        if (existentes.length >= 20) {
            return res.status(400).json({ message: "Se hizo el máximo posible de usuarios test" });
        }
        const numeros = existentes.map(u => {
            const n = Number(u.email.match(/^test(\d+)@a\.com$/)?.[1]);
            return Number.isNaN(n) ? 0 : n;
        });
        const num = numeros.length ? Math.max(...numeros) + 1 : 1;

        const usuario = await Usuario.create({
            nombre: "Test",
            apellido: "User",
            DNI: "0000" + String(num),
            telefono: "0000" + String(num),
            email: `test${num}@a.com`,
            contraseña: await bcrypt.hash("123", 10)
        });

        res.status(200).json({ message: "Usuario test creado correctamente, contraseña: 123", user: usuario });
    } catch (error) {
    console.error(error.errors || error);
    res.status(500).json({
        error: error.message,
        detalles: error.errors?.map(e => ({ campo: e.path, mensaje: e.message }))
    });
    }
}

const changePassword = async(req,res) => {
    try{
        const {contraseña, nuevaContraseña} = req.body
        const {id} = req.params
        const user = Usuario.findByPk(id)
        const validPassword = await bcrypt.compare(contraseña, user.contraseña)
        
        if (!validPassword){
            res.status(400).json({message: 'La contraseña actual no es esa'})
        }
         
        user.update({'contraseña' :  nuevaContraseña})

        res.status(200).json({message: 'CONTRASE;A MODOFICADA CORRECTAMENTE'})
        
    }catch(error){
        
    }
}   

const getBuscarUsuarioPelicula = async (req, res) => {
    try {
        const {id} = req.body
        Usuario.findAll(
            {
                where: {
                    id_Usuario : id
                },
                include: {
                    model: Transaccion,
                    required: true,
                    where:{
                        id_Usuario : id
                    },
                    include: {
                        model: CompraTicket,
                        required: true,
                        include:{
                            model: Asiento,
                            required: true,
                            include: {
                                model: Funcion,
                                required: true,
                                include:{
                                    model: Pelicula,
                                    required: true,
                                }
                            }
                        }
                    }
                }
            }
        )
        const userCompra = await CompraTicket.findAll()

        console.log(userCompra)

        if (!userCompra) return res.status(201).json({message: "No comraste papu"})

        res.status(200).json({message: 'compro', userCompra})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const registrarUsuarioEnPelicula = async (req, res) => {
    try {
        const {idCliente, datosReserva, id_Funcion, Numero, Fila, Precio} = req.body
        const {Total, MetodoPago} = datosReserva
        const result = await sequelize.transaction( //Usamos transaction pq sino puede modificarse una parte de la bd, dar error desues y no rollbackearse
            async (t) => {
                const transactionNueva = Transaccion.create({
                    id_ClienteLogueado: idCliente,
                    Total,
                    MetodoPago,
                    DVH: 1
                },{transaction: t})
                
                const asientoNuevo = Asiento.create({
                    id_Funcion,
                    Numero,
                    Fila,
                    DVH: 1
                },{transaction: t})
                
                const compraTicketNuevo = CompraTicket.create({
                    id_Transaccion: transactionNueva.id_Transaccion,
                    id_Asiento: asientoNuevo.id_Asiento,
                    Precio,
                    DVH: 1
                },{transaction: t})


            }
        );
    } catch (error) {
        console.log({error})
    }
}



module.exports = {
    getUsers,
    getUserById,
    createUser,
    modifyuserById,
    deleteuserById,
    createTestUser,
    getBuscarUsuarioPelicula
}

