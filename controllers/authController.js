const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: "2h" });
    return token;
}


const loginUser = async (req, res) => {
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

        const { email, password } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({
                success: false,
                msg: "Email not found"
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                msg: "Password is incorrect"
            });
        }
        const accessToken = await generateAccessToken({user:userData});
        return res.status(200).json({
            success: true,
            msg: "Login Successfully..!!",
            type: "Bearer",
            token:accessToken,
            data: userData
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


const getProfile = async (req,res) => {
    try {
        const user_id = req.user._id;
        const userData = await User.findOne({_id: user_id});

        return res.status(200).json({
            success: true,
            msg: "profile data",
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
    registerUser,
    loginUser,
    getProfile
}