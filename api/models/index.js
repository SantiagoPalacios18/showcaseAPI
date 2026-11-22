const { Actor } = require('./actor__Model.js');
const { Actor_Pelicula } = require('./actor_pelicula__Model.js');
const { Asiento } = require('./asiento__Model.js');
const { Cine } = require('./cine__Model.js');
const { CompraEvento } = require('./CompraEvento__Model.js');
const { CompraTicket } = require('./compraTicket__Model.js');
const { Funcion } = require('./funcion__Model.js');
const { Idioma } = require('./idioma__Model.js');
const { Idioma_Pelicula } = require('./Idioma_Pelicula__Model.js');
const { Patente } = require('./patente__Model.js');
const { Patente_Rol } = require('./patente_rol__Model.js');
const { Patente_Usuario} = require('./patente_Usuario__Model.js');

const { Pelicula } = require('./pelicula__Model.js');
const { Pelicula_cine } = require('./pelicula_cine__Model.js');

const { Proyeccion } = require('./proyeccion__Model.js');
const { Proyeccion_Pelicula } = require('./Proyeccion_Pelicula__Model.js');

const { Rol } = require('./rol__Model.js');
const { Sala } = require('./sala__Model.js');

const { Sesion } = require('./sesion__Model.js')
const { Sorteo } = require('./sorteo__Model.js');
const { Tecnologia } = require('./tecnologia__Model.js');

const { Transaccion } = require('./transaccion__Model.js');

const { Usuario } = require('./usuario__Model.js');

const { Usuario_Sorteo } = require('./Usuario_Sorteo__Model.js');

const { Code } = require('./code__model.js')

const { DVV } = require('./DVV__Model.js');
const { Bitacora } = require('./bitacora__Model.js');

Usuario.hasMany(Sorteo, {foreignkey: 'id_Ganador'})
Sorteo.belongsTo(Usuario, {foreignkey: 'id_Ganador'})

Bitacora.belongsTo(Usuario, {foreignKey: 'id_Usuario'})
Usuario.hasOne(Bitacora, {foreignKey: 'id_Usuario'})

//const { Patente_Usuario } = require('./patente_usuario__Model.js');

// ==========================================
// RELACIONES 1 A N (HASMANY / BELONGSTO)
// ==========================================


// Cine <-> Sala
Cine.hasMany(Sala, { foreignKey: 'id_Cine' });
Sala.belongsTo(Cine, { foreignKey: 'id_Cine' });

// Sala <-> Funcion
Sala.hasMany(Funcion, { foreignKey: 'id_Sala' });
Funcion.belongsTo(Sala, { foreignKey: 'id_Sala' });

// Pelicula <-> Funcion (Sin relación directa Cine-Pelicula)
Pelicula.hasMany(Funcion, { foreignKey: 'id_Pelicula' });
Funcion.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });

// Tecnologia <-> Funcion
Tecnologia.hasMany(Funcion, { foreignKey: 'id_Tecnologia' });
Funcion.belongsTo(Tecnologia, { foreignKey: 'id_Tecnologia' });

// Proyeccion <-> Funcion
Proyeccion.hasMany(Funcion, { foreignKey: 'id_Proyeccion' });
Funcion.belongsTo(Proyeccion, { foreignKey: 'id_Proyeccion' });

// Funcion <-> Asiento
Funcion.hasMany(Asiento, { foreignKey: 'id_Funcion' });
Asiento.belongsTo(Funcion, { foreignKey: 'id_Funcion' });

// Rol <-> Usuario 
Rol.hasMany(Usuario, { foreignKey: 'id_Rol' });
Usuario.belongsTo(Rol, { foreignKey: 'id_Rol' });


// Usuario <-> Transaccion
Usuario.hasMany(Transaccion, { foreignKey: 'id_Usuario' });
Transaccion.belongsTo(Transaccion, { foreignKey: 'id_Usuario' });

// Transaccion <-> CompraTicket
Transaccion.hasMany(CompraTicket, { foreignKey: 'id_Transaccion' });
CompraTicket.belongsTo(Transaccion, { foreignKey: 'id_Transaccion' });

// Asiento <-> CompraTicket
Asiento.hasMany(CompraTicket, { foreignKey: 'id_Asiento' });
CompraTicket.belongsTo(Asiento, { foreignKey: 'id_Asiento' });

// Usuario <-> CompraEvento
Usuario.hasMany(CompraEvento, { foreignKey: 'id_Usuario' });
CompraEvento.belongsTo(Usuario, { foreignKey: 'id_Usuario' });

// Funcion <-> CompraEvento
Funcion.hasMany(CompraEvento, { foreignKey: 'id_Funcion' });
CompraEvento.belongsTo(Funcion, { foreignKey: 'id_Funcion' });

// Sala <-> CompraEvento (Añadido para las reservas de espacios/cumpleaños/corporativos)
Sala.hasMany(CompraEvento, { foreignKey: 'id_Sala' });
CompraEvento.belongsTo(Sala, { foreignKey: 'id_Sala' });

Code.belongsTo(Usuario, {foreignKey: 'id_Usuario'})
Usuario.hasOne(Code, {foreignKey: 'id_Usuario'})

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


// Usuario MAS  Sorteo (a través de cliente_sorteo)
Usuario.belongsToMany(Sorteo, { through: Usuario_Sorteo, foreignKey: 'id_Usuario' });
Sorteo.belongsToMany(Usuario, { through: Usuario_Sorteo, foreignKey: 'id_Sorteo' });
Usuario.hasMany(Usuario_Sorteo, { foreignKey: 'id_Usuario' });
Usuario_Sorteo.belongsTo(Usuario, { foreignKey: 'id_Usuario' });
Sorteo.hasMany(Usuario_Sorteo, { foreignKey: 'id_Sorteo' });
Usuario_Sorteo.belongsTo(Sorteo, { foreignKey: 'id_Sorteo' });

// Actor MAS Pelicula (a través de Actor_Pelicula)
Actor.belongsToMany(Pelicula, { through: Actor_Pelicula, foreignKey: 'id_Actor' });
Pelicula.belongsToMany(Actor, { through: Actor_Pelicula, foreignKey: 'id_Pelicula' });
Actor.hasMany(Actor_Pelicula, { foreignKey: 'id_Actor' });
Actor_Pelicula.belongsTo(Actor, { foreignKey: 'id_Actor' });
Pelicula.hasMany(Actor_Pelicula, { foreignKey: 'id_Pelicula' });
Actor_Pelicula.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });

// Pelicula MAS Idioma (a través de Idioma_Pelicula)
Pelicula.belongsToMany(Idioma, { through: Idioma_Pelicula, foreignKey: 'id_Pelicula' });
Idioma.belongsToMany(Pelicula, { through: Idioma_Pelicula, foreignKey: 'id_Idioma' });
Pelicula.hasMany(Idioma_Pelicula, { foreignKey: 'id_Pelicula' });
Idioma_Pelicula.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });
Idioma.hasMany(Idioma_Pelicula, { foreignKey: 'id_Idioma' });
Idioma_Pelicula.belongsTo(Idioma, { foreignKey: 'id_Idioma' });

// Pelicula MAS Proyeccion (a través de Proyeccion_Pelicula)
Pelicula.belongsToMany(Proyeccion, { through: Proyeccion_Pelicula, foreignKey: 'id_Pelicula' });
Proyeccion.belongsToMany(Pelicula, { through: Proyeccion_Pelicula, foreignKey: 'id_Proyeccion' });
Pelicula.hasMany(Proyeccion_Pelicula, { foreignKey: 'id_Pelicula' });
Proyeccion_Pelicula.belongsTo(Pelicula, { foreignKey: 'id_Pelicula' });
Proyeccion.hasMany(Proyeccion_Pelicula, { foreignKey: 'id_Proyeccion' });
Proyeccion_Pelicula.belongsTo(Proyeccion, { foreignKey: 'id_Proyeccion' });

const { engancharIntegridad } = require('../services/integridad__Service.js');
engancharIntegridad();

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
    Usuario_Sorteo,
    CompraTicket,
    Funcion,
    Idioma,
    Idioma_Pelicula,
    Pelicula_cine,
    Proyeccion_Pelicula,
    Sorteo,
    Tecnologia,
    Transaccion,
    Usuario,
    Patente_Usuario,
    Sesion,
    Code,
    Bitacora,
    DVV
};