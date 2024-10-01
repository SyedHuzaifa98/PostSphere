const { check } = require('express-validator');


exports.permissionAddValidator = [
    check('permission_name', 'Please enter permission').not().isEmpty()
]