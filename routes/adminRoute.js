const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware');
const permissionController = require('../controllers/admin/permissionConstroller');
const { permissionAddValidator, permissionDeleteValidator ,permissionUpdateValidator} = require('../helpers/adminValidator');

// below is 'registerValidator' is middleware used apply on req

router.post('/add-permission', auth, permissionAddValidator, permissionController.addPermission);
router.get('/get-permission', auth, permissionController.getPermission);
router.post('/delete-permission', auth, permissionDeleteValidator, permissionController.deletePermission);
router.post('/update-permission', auth, permissionUpdateValidator, permissionController.updatePermission);

module.exports = router