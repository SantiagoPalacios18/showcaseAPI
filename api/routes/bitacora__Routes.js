const { Router } = require('express');
const { Bitacora } = require('../models/bitacora__Model.js');
const { checkPatent } = require('../middlewares/auth__Middleware.js');

const router = Router();

router.get('/', checkPatent('GET_REGISTERS'), async (req, res) => {
    try {
        const registros = await Bitacora.findAll({
            order: [['id_Bitacora', 'DESC']]
        });
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
