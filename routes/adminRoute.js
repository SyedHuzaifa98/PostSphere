const express = require('express');
const router = express();
const permissionController = require('../controllers/admin/permissionConstroller');
const {permissionAddValidator} = require('../helpers/adminValidator');

// below is 'registerValidator' is middleware used apply on req

router.post('/add-permission', permissionAddValidator, permissionController.addPermission);

module.exports = router