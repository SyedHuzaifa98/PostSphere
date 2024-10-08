const { check } = require('express-validator');
exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Please enter password').not().isEmpty()
]


exports.loginValidator = [
    check('email', 'Please enter valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password', 'Please enter password').not().isEmpty()
]


exports.createUserValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    })
]


exports.updateUserValidator = [
    check('id', 'id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty()
]