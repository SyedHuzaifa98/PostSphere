const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const Permission = require('../models/permissionModel');
const UserPermission = require('../models/userPermissionModel');
const { sendMail } = require('../helpers/mailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');
const { default: mongoose } = require('mongoose');
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

        // add permission to user if coming in request
        if (req.body.permissions != undefined && req.body.permissions.length > 0) {
            console.log("Hello");
            const addPermission = req.body.permissions;
            console.log(addPermission)
            const permissionArray = [];
            // we inserted mapping code in Promise.all() because we want untill this mapping will not completed 
            // not run userPermission code 
            await Promise.all(
                addPermission.map(async (permission) => {
                    const permissionData = await Permission.findOne({ _id: permission.id });

                    permissionArray.push({
                        permission_name: permissionData.permission_name,
                        permission_value: permission.value
                    });
                })
            );
            //console.log(permissionArray);
            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: permissionArray
            });

            await userPermission.save();

        }



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
        // const users = await User.find({
        //     _id: {
        //         $ne: req.user._id
        //     }
        // });

        // get user data with all permissions
        const users = await User.aggregate(
            [
                {
                    $match: { _id: { $ne: new mongoose.Types.ObjectId(req.user._id) } } // $match means from which column of User you want to match
                },
                {
                    $lookup: {
                        from: "userpermissions", // 'from' table name from which User is connected in which User id entered as foreing key
                        localField: "_id", // 'localField' in this we write primary key of current table e.g 'User'
                        foreignField: "user_id", // 'foreignField' in this we write column foreign key in from table
                        as: "permissions" // 'as' means we defining key name in which we want data that we bringing
                    }
                },
                {
                    // in 'project' object we define which keys we want 0 means we dont want 1 means we want
                    $project: {
                        _id: 0,
                        name: 1,
                        email: 1,
                        role: 1,
                        //permissions:1  if this we do it return array that is not good we have to sent in object

                        permissions: {
                            $cond: {
                                if: { $isArray: "$permissions" },
                                then: { $arrayElemAt: ["$permissions", 0] },// default $permissions given an array 
                                //so we take 0 index object from array
                                else: null // in null case if some user have not any permissions then 
                                //it is not returing permissions key in this case it 
                                //should return like this permissions:{} , so for this we add addfields it add another key
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        "permissions": {
                            "permissions": "$permissions.permissions"
                        }
                    }
                }
            ]
        );
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

        // add permission to user if coming in request
        if (req.body.permissions != undefined && req.body.permissions.length > 0) {
            console.log("Hello");
            const addPermission = req.body.permissions;
            console.log(addPermission)
            const permissionArray = [];
            // we inserted mapping code in Promise.all() because we want untill this mapping will not completed 
            // not run userPermission code 
            await Promise.all(
                addPermission.map(async (permission) => {
                    const permissionData = await Permission.findOne({ _id: permission.id });

                    permissionArray.push({
                        permission_name: permissionData.permission_name,
                        permission_value: permission.value
                    });
                })
            );
            await UserPermission.findOneAndUpdate(
                { user_id: updatedData._id },
                {
                    permissions: permissionArray
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
                // upsert: true
                //     Purpose: If set to true, MongoDB will create a new document 
                //     if no document matches the filter.
                //     In Context: Ensures that if there's no 
                //     existing UserPermission document for the specified user_id, 
                //     a new one will be created with the provided permissions.

                // new: true
                //     Purpose: When set to true, the method returns the updated document. 
                //     By default, it returns the document as it was before the update.
                //     In Context: After the update operation, you receive the latest version 
                //     of the document, which includes the updated permissions.

                // setDefaultsOnInsert: true
                //     Purpose: When creating a new document via upsert, this option ensures that default values 
                //     specified in the Mongoose schema are applied.
                //     In Context: If a new UserPermission document is created 
                //     (because one didn't exist for the user_id), it will include 
                //         any default values defined in the schema, ensuring data consistency.
            );
        }
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


const deleteUser = async (req, res) => {
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
        await User.findByIdAndDelete({
            _id: id
        });

        return res.status(200).json({
            success: true,
            msg: "User deleted successfully",
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
    updateUser,
    deleteUser
}