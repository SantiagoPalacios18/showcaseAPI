const { User } = require('./userModel');
const { Hobby } = require('./hobbyModel');

// Relación muchos a muchos
User.belongsToMany(Hobby, { through: 'user_hobbies', foreignKey: 'user_id', timestamps: false });
Hobby.belongsToMany(User, { through: 'user_hobbies', foreignKey: 'hobby_id', timestamps: false });

// Dato piola: Antes yo lo había hecho poniendo foreignKey y ADEMAS un otherKey, pensando de que así se iba a armar correctamente la clave compuesta
// Pero al parecer, al armar el puente de cada lado (Del user al hobby y del hobby al user), sequelize identifica de que tiene que armar una clave compuesta


module.exports = { User, Hobby };

// A lo mejor te preguntas "por qué no importamos la tabla intermedia" y la respuesta es que
// la tabla intermedia ya está establecida dentro de Users y Hobby, si te fijas arriba, el belongsToMany es un metodo para ambos, por ende ya está dentro de ellas
