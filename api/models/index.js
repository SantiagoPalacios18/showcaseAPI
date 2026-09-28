

const { Actor } = require('./actor__Model.js');
const { Actor_Pelicula } = require('./actor_pelicula__Model.js');

const { Asiento } = require('./asiento__Model.js');
const { Cine } = require('./cine__Model.js');

const { CompraEvento } = require('./CompraEvento__Model.js');


const { Patente } = require('./patente__Model.js');
const { Patente_Rol } = require('./patente_rol__Model.js');
const { Patente_Usuario} = require('./patente_Usuario__Model.js');


const { Pelicula } = require('./pelicula__Model.js');
const { Proyeccion } = require('./proyeccion__Model.js');

const { Rol } = require('./rol__Model.js');
const { Sala } = require('./sala__Model.js');

const { Usuario_sorteo } = require('./usuario_sorteo__Model.js');
const { compraTicket } = require('./compraTicket__Model.js');

const { funcion } = require('./funcion__Model.js');
const { Funcion_Asiento } = require('./DVV__Model.js');

const { idioma } = require('./idioma__Model.js');
const { idioma_pelicula } = require('./idioma_pelicula__Model.js');

const { pelicula_cine } = require('./pelicula_cine__Model.js');



const { proyeccion_pelicula } = require('./proyeccion_pelicula__Model.js');


const { soporte } = require('./soporteTecnico__Model.js');



const { tecnologia } = require('./tecnologia__Model.js');

const { transaccion } = require('./transaccion__Model.js');

const { Usuario } = require('./usuario__Model.js');
//const { Patente_Usuario } = require('./patente_usuario__Model.js');

// ==========================================
// 1. RELACIONES 1 A N (HASMANY / BELONGSTO)
// ==========================================
/*
// Cine <-> Sala
Cine.hasMany(Sala, { foreignKey: 'id_Cine' });
Sala.belongsTo(Cine, { foreignKey: 'id_Cine' });

// Sala <-> Funcion
Sala.hasMany(funcion, { foreignKey: 'id_sala' });
funcion.belongsTo(Sala, { foreignKey: 'id_sala' });

// Pelicula <-> Funcion (Sin relación directa Cine-Pelicula)
Pelicula.hasMany(funcion, { foreignKey: 'id_pelicula' });
funcion.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });

// Tecnologia <-> Funcion
tecnologia.hasMany(funcion, { foreignKey: 'id_tecnologia' });
funcion.belongsTo(tecnologia, { foreignKey: 'id_tecnologia' });

// Funcion <-> Asiento
funcion.hasMany(Asiento, { foreignKey: 'id_Funcion' });
Asiento.belongsTo(funcion, { foreignKey: 'id_Funcion' });

// Rol <-> Usuario 
Rol.hasMany(Usuario, { foreignKey: 'id_Rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_Rol' });


// Usuario <-> Transaccion
Usuario.hasMany(transaccion, { foreignKey: 'id_Usuario' });
transaccion.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

// Transaccion <-> CompraTicket
transaccion.hasMany(compraTicket, { foreignKey: 'id_transaccion' });
compraTicket.belongsTo(transaccion, { foreignKey: 'id_transaccion' });

// Asiento <-> CompraTicket
Asiento.hasMany(compraTicket, { foreignKey: 'id_Asiento' });
compraTicket.belongsTo(Asiento, { foreignKey: 'id_Asiento' });

// Usuario <-> CompraEvento
Usuario.hasMany(CompraEvento, { foreignKey: 'id_Usuario' });
CompraEvento.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

// Funcion <-> CompraEvento
funcion.hasMany(CompraEvento, { foreignKey: 'id_Funcion' });
CompraEvento.belongsTo(funcion, { foreignKey: 'id_Funcion' });


// 2. RELACIONES MUCHOS A MUCHOS 


// Rol MASS Patente (a través de Patente_Rol)
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
Usuario.belongsToMany(sorteo, { through: cliente_sorteo, foreignKey: 'id_Usuario' });
sorteo.belongsToMany(Usuario, { through: cliente_sorteo, foreignKey: 'id_sorteo' });
Usuario.hasMany(cliente_sorteo, { foreignKey: 'id_Usuario' });
cliente_sorteo.belongsTo(Usuario, { foreignKey: 'id_Usuario' });
sorteo.hasMany(cliente_sorteo, { foreignKey: 'id_sorteo' });
cliente_sorteo.belongsTo(sorteo, { foreignKey: 'id_sorteo' });

// Actor MASS Pelicula (a través de Actor_Pelicula)
Actor.belongsToMany(Pelicula, { through: Actor_Pelicula, foreignKey: 'id_Actor' });
Pelicula.belongsToMany(Actor, { through: Actor_Pelicula, foreignKey: 'id_Pelicula' });
Actor.hasMany(Actor_Pelicula, { foreignKey: 'id_Actor' });
Actor_Pelicula.belongsTo(Actor, { foreignKey: 'id_Actor' });
Pelicula.hasMany(Actor_Pelicula, { foreignKey: 'id_Pelicula' });
Actor_Pelicula.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });

// Pelicula MASS Idioma (a través de idioma_pelicula)
Pelicula.belongsToMany(idioma, { through: idioma_pelicula, foreignKey: 'id_pelicula' });
idioma.belongsToMany(Pelicula, { through: idioma_pelicula, foreignKey: 'id_idioma' });
Pelicula.hasMany(idioma_pelicula, { foreignKey: 'id_pelicula' });
idioma_pelicula.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });
idioma.hasMany(idioma_pelicula, { foreignKey: 'id_idioma' });
idioma_pelicula.belongsTo(idioma, { foreignKey: 'id_idioma' });

// Pelicula MASS Proyeccion (a través de proyeccion_pelicula)
Pelicula.belongsToMany(Proyeccion, { through: proyeccion_pelicula, foreignKey: 'id_pelicula' });
Proyeccion.belongsToMany(Pelicula, { through: proyeccion_pelicula, foreignKey: 'id_proyeccion' });
Pelicula.hasMany(proyeccion_pelicula, { foreignKey: 'id_pelicula' });
proyeccion_pelicula.belongsTo(Pelicula, { foreignKey: 'id_pelicula' });
Proyeccion.hasMany(proyeccion_pelicula, { foreignKey: 'id_proyeccion' });
proyeccion_pelicula.belongsTo(Proyeccion, { foreignKey: 'id_proyeccion' });


*/

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
    /*compraTicket,
    funcion,
    idioma,
    idioma_pelicula,
    pelicula_cine,
    proyeccion_pelicula,
    sorteo,
    soporteTecnico,
    tecnologia,
    transaccion,*/
    Usuario,
    Patente_Usuario
};