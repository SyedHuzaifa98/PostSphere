const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
// const express = require('express');
// const router = express();


const registerUser = async (req, res) => {
   //console.log(req.body);
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;
        const isExistUser = await User.findOne({ email });
        if (isExistUser) {
            return res.status(200).json({
                success: false,
                msg: 'Email already exist',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        const userData = await user.save();
        return res.status(200).json({
            success: true,
            msg: 'Registered Successfully..!!',
            data: userData
        });




    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}

module.exports = {
    registerUser
}