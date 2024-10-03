const { validationResult } = require('express-validator');
const Post = require('../models/postModel');


const createPost = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }
        const { title, description } = req.body;
        var obj = {
            title,
            description
        }
        if (req.body.categories) {
            obj.categories = req.body.categories
        }
        const post = new Post(obj);
        const postData = await post.save();

        const postFullData = await Post.findOne({
            _id: postData.id,
        }).populate("categories");




        return res.status(200).json({
            success: true,
            msg: "Post added successfully",
            data: postFullData
        });



    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('categories');
        return res.status(200).json({
            success: true,
            msg: "Posts fetched successfully",
            data: posts
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        });
    }
}


// const deleteCategory = async (req, res) => {
//     try {

//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(200).json({
//                 success: false,
//                 msg: 'Errors',
//                 errors: errors.array()
//             });
//         }
//         const { id } = req.body;
//         const categoryData = await Category.findOne({ _id: id });
//         if (!categoryData) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Category ID doesn't exist"
//             });
//         }
//         await Category.findByIdAndDelete({
//             _id: id
//         });

//         return res.status(200).json({
//             success: true,
//             msg: "Category deleted successfully..!!"
//         });



//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message
//         });
//     }
// }


// const updateCategory = async (req, res) => {
//     try {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(200).json({
//                 success: false,
//                 msg: 'Errors',
//                 errors: errors.array()
//             });
//         }
//         const { id, category_name } = req.body;
//         const categoryData = await Category.findOne({ _id: id });
//         if (!categoryData) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Category ID doesn't exist"
//             });
//         }
//         const isExists = await Category.findOne({
//             _id: {$ne:id},
//             name: {
//                 $regex: category_name,
//                 $options: "i"
//             }
//         });

//         if (isExists) {
//             return res.status(400).json({
//                 success: false,
//                 msg: "Category name already already assigned to another category"
//             });
//         }

//         const updatedData = await Category.findByIdAndUpdate(
//             { _id: id, },
//             { $set: { name: category_name } },
//             { new: true }
//         );

//         return res.status(200).json({
//             success: true,
//             msg: "Category updated successfully..!!",
//             data: updatedData
//         });



//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message
//         });
//     }
// }
module.exports = {
    createPost,
    getPosts
}