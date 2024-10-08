const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware');
const permissionController = require('../controllers/admin/permissionConstroller');
const roleController = require('../controllers/admin/roleController');
const { permissionAddValidator, permissionDeleteValidator, permissionUpdateValidator, storeRoleValidator } = require('../helpers/adminValidator');
const { onlyAdminAccess } = require('../middlewares/adminMiddleware');

// below is 'registerValidator' is middleware used apply on req

router.post('/add-permission', auth,onlyAdminAccess, permissionAddValidator, permissionController.addPermission);
router.get('/get-permission', auth, onlyAdminAccess, permissionController.getPermission);
router.post('/delete-permission', auth,onlyAdminAccess, permissionDeleteValidator, permissionController.deletePermission);
router.post('/update-permission', auth,onlyAdminAccess, permissionUpdateValidator, permissionController.updatePermission);



// role routes
router.post('/store-role', auth,onlyAdminAccess, storeRoleValidator, roleController.storeRoles);
router.get('/get-roles', auth,onlyAdminAccess, roleController.getRoles);


module.exports = router