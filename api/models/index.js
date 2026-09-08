const {Actor} = require('./actor__Model.js') 
const {Actor_Pelicula } = require('./actor_Pelicula__Model.js')
const { AdministradorBD } = require('./administradorBD__Model.js') 
const { Asiento } = require('./asiento__Model.js') 
const { Cine } = require('./cine__Model.js') 
const { Usuario } = require('./usuario__Model.js') 
const { CompraCandy } = require('./compraCandy__Model.js') 
const { Cliente_sorteo } = require('./cliente_sorteo__Model.js')
const { CompraEvento } = require('./CompraEvento__Model.js')
const { CompraTicket } = require('./compraTicket__Model.js')
const { DVV } = require('./DVV__Model.js')
const { Funcion } = require('./funcion__Model.js')
const { Idioma } = require('./idioma__Model.js')
const { Idioma_pelicula } = require('./idioma_pelicula.js')
const {Operador_Candy} = require('./operadorCandy__Model.js') 
const {Patente} = require('./patente__Model.js') 
const {Patente_Rol} = require('./patente_rol__Model.js') 
const {Pelicula} = require('./pelicula__Model.js') 
const { Pelicula_cine } = require('./pelicula_cine.js')
const {ProductoCandy} = require('./productoCandy__Model.js') 
const { ProductoCandy_ComprasCandy } = require('./ProductoCandy_ComprasCandy__Model.js')
const {Proyeccion} = require('./proyeccion__Model.js') 
const { Proyeccion_pelicula } = require('./proyeccion_pelicula__Model.js')
const {Rol} = require('./rol__Model.js') 
const {Sala} = require('./sala__Model.js') 
const { Sesion } = require('./sesion__Model.js')
const { SoporteTecnico } = require('./soporteTecnico.js')
const { Sorteo } = require('./sorteo__Model.js')
const { Tecnologia } = require('./tecnologia__Model.js')
const { Transaccion } = require('./transaccion__Model.js')


module.exports = {
    Actor,
    Actor_Pelicula,
    AdministradorBD,
    Asiento,
    Cine,
    Cliente_sorteo,
    CompraCandy,
    CompraEvento,
    CompraTicket,
    DVV,
    Usuario,
    Operador_Candy,
    Patente,
    Patente_Rol,
    Pelicula,
    ProductoCandy,
    Proyeccion,
    Rol,
    Sala,
    Funcion,
    Idioma,
    Idioma_pelicula,
    Operador_Candy,
    Patente,
    // Funcion_Asiento
    Patente_Rol,
    Pelicula,
    Pelicula_cine,
    ProductoCandy,
    ProductoCandy_ComprasCandy,
    Proyeccion,
    Proyeccion_pelicula,
    Rol,
    Sala,
    Sesion,
    SoporteTecnico,
    Sorteo,
    Tecnologia,
    Transaccion,
    Usuario
}








