const { sequelize } = require('../config/db.js');
const AUTO_FIELDS = ['createdat', 'updatedat', 'deletedat'];


const getAllTables = async (req,res)=>{
    const tablas = await sequelize.getQueryInterface().showAllTables();
    res.status(200).json(tablas)
    console.log(tablas)
}


const getTableFields = async (req, res) => {
    try {
        const { tabla } = req.params;
        const qi = sequelize.getQueryInterface();

        // SOlo permite tablas que existen
        const existentes = (await qi.showAllTables())
            .map(t => (typeof t === 'string' ? t : t.tableName)); // Busca todas las tablas con los nombres
        if (!existentes.includes(tabla)) { // Si la tabla pedida no está dentro de la lista de todas las tablas, lanza error
            return res.status(404).json({ message: "Tabla inexistente" });
        }

        const descripcion = await qi.describeTable(tabla); // Investigar qué es el describeTable

        const campos = Object.entries(descripcion)
            .filter(([nombre, info]) =>
                !info.autoIncrement && !AUTO_FIELDS.includes(nombre.toLowerCase())
            )
            .map(([nombre, info]) => ({
                name: nombre,
                type: String(info.type).toUpperCase(),
                required: !info.allowNull && info.defaultValue == null,
                primaryKey: info.primaryKey,
            }));

        res.json(campos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los campos" });
    }
};

module.exports = { getAllTables, getTableFields };