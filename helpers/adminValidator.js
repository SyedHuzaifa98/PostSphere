const { check } = require('express-validator');


exports.permissionAddValidator = [
    check('permission_name', 'Please enter permission_name').not().isEmpty()
]


exports.permissionDeleteValidator = [
    check('id', 'id required').not().isEmpty()
]

exports.permissionUpdateValidator = [
    check('id', 'ID required').not().isEmpty(),
    check('permission_name', 'permission_name is required').not().isEmpty()
]


exports.categoryAddValidator = [
    check('category_name', 'category_name is required').not().isEmpty()
]

exports.categoryDeleteValidator = [
    check('id', 'id required').not().isEmpty()
]

exports.categoryUpdateValidator = [
    check('id', 'id required').not().isEmpty(),
    check('category_name', 'category_name is required').not().isEmpty()
]


exports.createPostValidator = [
    check('title', 'title required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty()
]


exports.deletePostValidator = [
    check('id', 'id required').not().isEmpty()
]


exports.updatePostValidator = [
    check('id', 'id required').not().isEmpty(),
    check('title', 'title required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty()
]




exports.storeRoleValidator = [
    check('role_name', 'role_name required').not().isEmpty(),
    check('value', 'value required').not().isEmpty(),
]






exports.addRouterPermissionValidator = [
    check('router_endpoint', 'router_endpoint required').not().isEmpty(),
    check('role', 'role required').not().isEmpty(),
    check('permission', 'permission must be an array').isArray()
]
