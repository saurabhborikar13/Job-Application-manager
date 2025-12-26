const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/getUser').get(authenticateUser,getUser);

module.exports = router;