const { validationResult } = require('express-validator');
const Like = require('../models/likeModel');
const postLike = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors:',
                errors: errors.array()
            });
        }
        const { user_id, post_id } = req.body;
        const isLiked = await Like.findOne({
            user_id,
            post_id
        });
        if (isLiked) {
            return res.status(400).json({
                success: false,
                msg: "Already liked !",
            });
        }


        const like = new Like({
            user_id,
            post_id
        })
        const likeData = await like.save();
        return res.status(200).json({
            success: true,
            msg: "Post Liked",
            data: likeData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}


const postUnLike = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors:',
                errors: errors.array()
            });
        }
        const { user_id, post_id } = req.body;
        const isLiked = await Like.findOne({
            user_id,
            post_id
        });
        if (!isLiked) {
            return res.status(400).json({
                success: false,
                msg: "You have not liked !",
            });
        }
        await Like.deleteOne({
            user_id,
            post_id
        });

        return res.status(200).json({
            success: true,
            msg: "Post UnLiked",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}


const postLikeCount = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                msg: 'Errors:',
                errors: errors.array()
            });
        }
        const { post_id } = req.body;

        const likeCount = await Like.find({
            post_id
        }).countDocuments();

        return res.status(200).json({
            success: true,
            msg: "Post Like Count",
            data: likeCount
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}
module.exports = {
    postLike,
    postUnLike,
    postLikeCount
}