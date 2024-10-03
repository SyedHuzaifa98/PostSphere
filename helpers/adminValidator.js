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