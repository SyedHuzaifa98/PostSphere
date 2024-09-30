const express = require('express');
const router = express();

const authController = require('../controllers/authController')
const {registerValidator} = require('../helpers/validator');

// below is 'registerValidator' is middleware used apply on req
router.post('/register', registerValidator, authController.registerUser);

module.exports = router