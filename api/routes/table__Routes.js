const express = require('express');
const router = express.Router();
const {
    getAllTables,
    getTableFields,
} = require('../controllers/table__Controller');

router.get('/getAllTables', getAllTables);
router.get('/getTableFields', getTableFields);

module.exports = router;
