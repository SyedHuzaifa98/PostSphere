const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const { sendMail } = require('../helpers/mailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors:',
                errors: errors.array()
            });
        }
        const { name, email } = req.body;
        const isExists = await User.findOne({
            email
        });

        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Email is already exists!'
            });
        }

        const password = randomstring.generate(6);
        const hashPassword = await bcrypt.hash(password, 10);
        var obj = {
            name,
            email,
            password: hashPassword
        }
        if (req.body.role && req.body.role == 1) {
            return res.status(400).json({
                success: false,
                msg: "You can't create admin"
            });
        }
        else if (req.body.role) {
            obj.role = req.body.role;
        }
        const user = User(obj);
        const userData = await user.save();
        console.log(password);
        const content = `
        <p>Hii <b>`+ userData.name + `</b> Your account is created , below is your details.</p>
        <table style="border-style:none;">
            <tr>
                <th>Name: </th>
                <td>`+ userData.name + `</td>
            </tr>
            <tr>
                <th>Email: </th>
                <td>`+ userData.email + `</td>
            </tr>
            <tr>
                <th>Password: </th>
                <td>`+ password + `</td>
            </tr>
        </table>
        <p> Now you can login your account in our application, Thanks..... </p>
        `;
        sendMail(userData.email, 'Account Created', content);

        return res.status(200).json({
            success: true,
            msg: 'User created successfully!',
            data: userData
        });


    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}
const getUsers = async (req, res) => {
    try {
        const users = await User.find({
            _id: {
                $ne: req.user._id
            }
        });
        return res.status(200).json({
            success: true,
            msg: "User Fetched Successfully!",
            data: users
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors:',
                errors: errors.array()
            });
        }
        const { id, name } = req.body;
        const isExists = await User.findOne({
            _id: id
        });

        if (!isExists) {
            return res.status(400).json({
                success: false,
                msg: 'User not exists!'
            });
        }
        var updateObj = {
            name
        }
        if (req.body.role != undefined) {
            updateObj.role = req.body.role;
        }
        const updatedData = await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: updateObj
            },
            {
                new: true
            }
        );

        return res.status(200).json({
            success: true,
            msg: "User Updated Successfully!",
            data: updatedData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}
module.exports = {
    createUser,
    getUsers,
    updateUser
}