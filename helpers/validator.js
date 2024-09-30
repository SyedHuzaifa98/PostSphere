const { check } = require('express-validator');
exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Please enter password').not().isEmpty()
]