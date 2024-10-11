const User = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const express = require('express');
// const router = express();
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');

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

        // assign default permissions
        const defaultPermissions = await Permission.find({
            is_default: 1
        });
        if (defaultPermissions.length > 0) {
            const permissionArray = [];
            defaultPermissions.forEach(permission => {
                permissionArray.push({
                    permission_name: permission.permission_name,
                    permission_value: [0, 1, 2, 3]
                });
            });
            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: permissionArray
            });
            await userPermission.save();
        }
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
        const accessToken = await generateAccessToken({ user: userData });

        // get user data with all permissions
        const result = await User.aggregate(
        [ 
            {
                $match: { email: userData.email} // $match means from which column of User you want to match
            },
            {
                $lookup:{
                    from:"userpermissions", // 'from' table name from which User is connected in which User id entered as foreing key
                    localField:"_id", // 'localField' in this we write primary key of current table e.g 'User'
                    foreignField:"user_id", // 'foreignField' in this we write column foreign key in from table
                    as:"permissions" // 'as' means we defining key name in which we want data that we bringing
                }
            },
            { 
                // in 'project' object we define which keys we want 0 means we dont want 1 means we want
                $project:{
                    _id: 0,
                    name: 1,
                    email:1,
                    role:1,
                    //permissions:1  if this we do it return array that is not good we have to sent in object
                    
                    permissions:{
                        $cond: {
                            if:{ $isArray: "$permissions"  },
                            then:{ $arrayElemAt: ["$permissions",0] },// default $permissions given an array 
                                                                    //so we take 0 index object from array
                            else: null // in null case if some user have not any permissions then 
                            //it is not returing permissions key in this case it 
                            //should return like this permissions:{} , so for this we add addfields it add another key
                        }
                    }
                }
            },
            {
                $addFields:{
                    "permissions":{
                        "permissions":"$permissions.permissions"
                    }
                }
            }
        ]
        );



        return res.status(200).json({
            success: true,
            msg: "Login Successfully..!!",
            type: "Bearer",
            token: accessToken,
            data: result
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


const getProfile = async (req, res) => {
    try {
        const user_id = req.user._id;
        const userData = await User.findOne({ _id: user_id });

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