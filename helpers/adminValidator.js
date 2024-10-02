const { check } = require('express-validator');


exports.permissionAddValidator = [
    check('permission_name', 'Please enter permission').not().isEmpty()
]


exports.permissionDeleteValidator = [
    check('id', 'ID required').not().isEmpty()
]

exports.permissionUpdateValidator = [
    check('id', 'ID required').not().isEmpty(),
    check('permission_name', 'Permission name is required').not().isEmpty()
]