const express = require('express');
const router = express.Router();
const { updateUser, getUser ,login, register } = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');


router.post('/register', register);
router.post('/login', login);

router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/getUser').get(authenticateUser,getUser);

module.exports = router;