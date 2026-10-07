

const { Actor } = require('./actor__Model.js');
const { Actor_Pelicula } = require('./actor_pelicula__Model.js');
const { Asiento } = require('./asiento__Model.js');
const { Cine } = require('./cine__Model.js');
const { CompraCandy } = require('./compraCandy__Model.js')
const { CompraEvento } = require('./CompraEvento__Model.js');
const { CompraTicket } = require('./compraTicket__Model.js');
const { Funcion } = require('./funcion__Model.js');
const { Idioma } = require('./idioma__Model.js');
const { Idioma_pelicula } = require('./idioma_pelicula__Model.js');
const { OperadorCandy } = require('./operadorCandy__Model.js')

const { Patente } = require('./patente__Model.js');
const { Patente_Rol } = require('./patente_rol__Model.js');
const { Patente_Usuario} = require('./patente_Usuario__Model.js');

const { Pelicula } = require('./pelicula__Model.js');
const { Pelicula_cine } = require('./pelicula_cine__Model.js');
const { ProductoCandy } = require('./productoCandy__Model.js')
const { ProductoCandy_ComprasCandy } = require('./ProductoCandy_ComprasCandy__Model.js')

const { Proyeccion } = require('./proyeccion__Model.js');
const { Proyeccion_pelicula } = require('./proyeccion_pelicula__Model.js');

const { Rol } = require('./rol__Model.js');
const { Sala } = require('./sala__Model.js');

const { Sesion } = require('./sesion__Model.js')
const { SoporteTecnico } = require('./soporteTecnico__Model.js');
const { Sorteo } = require('./sorteo__Model.js');
const { Tecnologia } = require('./tecnologia__Model.js');

const { Transaccion } = require('./transaccion__Model.js');

const { Usuario } = require('./usuario__Model.js');

const { Usuario_sorteo } = require('./usuario_sorteo__Model.js');


const { DVV } = require('./DVV__Model.js');



//const { Patente_Usuario } = require('./patente_usuario__Model.js');

// ==========================================
// RELACIONES 1 A N (HASMANY / BELONGSTO)
// ==========================================


// Cine <-> Sala
Cine.hasMany(Sala, { foreignKey: 'id_Cine' });
Sala.belongsTo(Cine, { foreignKey: 'id_Cine' });

// Sala <-> Funcion
Sala.hasMany(Funcion, { foreignKey: 'id_sala' });
Funcion.belongsTo(Sala, { foreignKey: 'id_sala' });

// Pelicula <-> Funcion (Sin relación directa Cine-Pelicula)
Pelicula.hasMany(Funcion, { foreignKey: 'id_pelicula' });
Funcion.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });

// Tecnologia <-> Funcion
Tecnologia.hasMany(Funcion, { foreignKey: 'id_tecnologia' });
Funcion.belongsTo(Tecnologia, { foreignKey: 'id_tecnologia' });

// Funcion <-> Asiento
Funcion.hasMany(Asiento, { foreignKey: 'id_Funcion' });
Asiento.belongsTo(Funcion, { foreignKey: 'id_Funcion' });

// Rol <-> Usuario 
Rol.hasMany(Usuario, { foreignKey: 'id_Rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_Rol' });


// Usuario <-> Transaccion
Usuario.hasMany(Transaccion, { foreignKey: 'id_Usuario' });
Transaccion.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

// Transaccion <-> CompraTicket
Transaccion.hasMany(CompraTicket, { foreignKey: 'id_transaccion' });
CompraTicket.belongsTo(Transaccion, { foreignKey: 'id_transaccion' });

// Asiento <-> CompraTicket
Asiento.hasMany(CompraTicket, { foreignKey: 'id_Asiento' });
CompraTicket.belongsTo(Asiento, { foreignKey: 'id_Asiento' });

// Usuario <-> CompraEvento
Usuario.hasMany(CompraEvento, { foreignKey: 'id_Usuario' });
CompraEvento.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

// Funcion <-> CompraEvento
Funcion.hasMany(CompraEvento, { foreignKey: 'id_Funcion' });
CompraEvento.belongsTo(Funcion, { foreignKey: 'id_Funcion' });

// ==========================================
// RELACIONES M a M (BELONGSTOMANY / HASMANY / BELONGSTO)
// ==========================================


// Rol + Patente (a través de Patente_Rol)
Rol.belongsToMany(Patente, { through: Patente_Rol, foreignKey: 'id_Rol' });
Patente.belongsToMany(Rol, { through: Patente_Rol, foreignKey: 'id_Patente' });
Rol.hasMany(Patente_Rol, { foreignKey: 'id_Rol' });
Patente_Rol.belongsTo(Rol, { foreignKey: 'id_Rol' });
Patente.hasMany(Patente_Rol, { foreignKey: 'id_Patente' });
Patente_Rol.belongsTo(Patente, { foreignKey: 'id_Patente' });

// Relación Muchos a Muchos directa 
Usuario.belongsToMany(Patente, { through: Patente_Usuario, foreignKey: 'id_Usuario' });
Patente.belongsToMany(Usuario, { through: Patente_Usuario, foreignKey: 'id_Patente' });

// Relaciones con la tabla intermedia 
Usuario.hasMany(Patente_Usuario, { foreignKey: 'id_Usuario' });
Patente_Usuario.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

Patente.hasMany(Patente_Usuario, { foreignKey: 'id_Patente' });
Patente_Usuario.belongsTo(Patente, { foreignKey: 'id_Patente' });


// Usuario M,ASS  Sorteo (a través de cliente_sorteo)
Usuario.belongsToMany(Sorteo, { through: Usuario_sorteo, foreignKey: 'id_Usuario' });
Sorteo.belongsToMany(Usuario, { through: Usuario_sorteo, foreignKey: 'id_sorteo' });
Usuario.hasMany(Usuario_sorteo, { foreignKey: 'id_Usuario' });
Usuario_sorteo.belongsTo(Usuario, { foreignKey: 'id_Usuario' });
Sorteo.hasMany(Usuario_sorteo, { foreignKey: 'id_sorteo' });
Usuario_sorteo.belongsTo(Sorteo, { foreignKey: 'id_sorteo' });

// Actor MASS Pelicula (a través de Actor_Pelicula)
Actor.belongsToMany(Pelicula, { through: Actor_Pelicula, foreignKey: 'id_Actor' });
Pelicula.belongsToMany(Actor, { through: Actor_Pelicula, foreignKey: 'id_Pelicula' });
Actor.hasMany(Actor_Pelicula, { foreignKey: 'id_Actor' });
Actor_Pelicula.belongsTo(Actor, { foreignKey: 'id_Actor' });
Pelicula.hasMany(Actor_Pelicula, { foreignKey: 'id_Pelicula' });
Actor_Pelicula.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });

// Pelicula MASS Idioma (a través de idioma_pelicula)
Pelicula.belongsToMany(Idioma, { through: Idioma_pelicula, foreignKey: 'id_pelicula' });
Idioma.belongsToMany(Pelicula, { through: Idioma_pelicula, foreignKey: 'id_idioma' });
Pelicula.hasMany(Idioma_pelicula, { foreignKey: 'id_pelicula' });
Idioma_pelicula.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });
Idioma.hasMany(Idioma_pelicula, { foreignKey: 'id_idioma' });
Idioma_pelicula.belongsTo(Idioma, { foreignKey: 'id_idioma' });

// Pelicula MASS Proyeccion (a través de proyeccion_pelicula)
Pelicula.belongsToMany(Proyeccion, { through: Proyeccion_pelicula, foreignKey: 'id_pelicula' });
Proyeccion.belongsToMany(Pelicula, { through: Proyeccion_pelicula, foreignKey: 'id_proyeccion' });
Pelicula.hasMany(Proyeccion_pelicula, { foreignKey: 'id_pelicula' });
Proyeccion_pelicula.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });
Proyeccion.hasMany(Proyeccion_pelicula, { foreignKey: 'id_proyeccion' });
Proyeccion_pelicula.belongsTo(Proyeccion, { foreignKey: 'id_proyeccion' });




module.exports = {
    Actor,
    Actor_Pelicula,
    Asiento,
    Cine,
    CompraEvento,
    Patente,
    Patente_Rol,
    Pelicula,
    Proyeccion,
    Rol,
    Sala,
    Usuario_sorteo,
    CompraTicket,
    Funcion,
    Idioma,
    Idioma_pelicula,
    Pelicula_cine,
    Proyeccion_pelicula,
    Sorteo,
    SoporteTecnico,
    Tecnologia,
    Transaccion,
    Usuario,
    Patente_Usuario
}; // d