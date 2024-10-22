const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const permissionController = require('../controllers/admin/permissionConstroller');
const roleController = require('../controllers/admin/roleController');
const routerController = require('../controllers/admin/routerController');


const { permissionAddValidator,
    permissionDeleteValidator,
    permissionUpdateValidator,
    storeRoleValidator,
    addRouterPermissionValidator,
    getRouterPermissionValidator
} = require('../helpers/adminValidator');
const { onlyAdminAccess } = require('../middlewares/adminMiddleware');

// below is 'registerValidator' is middleware used apply on req

router.post('/add-permission', auth, onlyAdminAccess, permissionAddValidator, permissionController.addPermission);
router.get('/get-permission', auth, onlyAdminAccess, permissionController.getPermission);
router.post('/delete-permission', auth, onlyAdminAccess, permissionDeleteValidator, permissionController.deletePermission);
router.post('/update-permission', auth, onlyAdminAccess, permissionUpdateValidator, permissionController.updatePermission);



// role routes
router.post('/store-role', auth, onlyAdminAccess, storeRoleValidator, roleController.storeRoles);
router.get('/get-roles', auth, onlyAdminAccess, roleController.getRoles);



// router permission routes
router.post('/add-router-permission', auth, onlyAdminAccess,addRouterPermissionValidator, routerController.addRouterPermission);
router.post('/get-router-permissions', auth, onlyAdminAccess,getRouterPermissionValidator, routerController.getRouterPermission);


module.exports = router