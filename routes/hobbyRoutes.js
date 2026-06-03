const { Router } = require('express');
const { getHobbies, createHobby } = require('../controllers/hobbyController');

const router = Router();

router.get('/', getHobbies);
router.post('/', createHobby);

module.exports = router;