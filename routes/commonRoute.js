const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware');
const {
    categoryAddValidator,
    categoryDeleteValidator,
    categoryUpdateValidator,
    createPostValidator,
    deletePostValidator,
    updatePostValidator
} = require('../helpers/adminValidator');
const {
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    postLikeUnlikeValidator,
    postLikeCountValidator
} = require('../helpers/validator');

const categoryController = require('../controllers/categoryController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController');
const likeController = require('../controllers/likeController');

// category routes
router.post('/add-category', auth, categoryAddValidator, categoryController.addCategory);
router.get('/get-categories', auth, categoryController.getCategories);
router.post('/delete-category', auth, categoryDeleteValidator, categoryController.deleteCategory);
router.post('/update-category', auth, categoryUpdateValidator, categoryController.updateCategory);


// post routes
router.post('/create-post', auth, createPostValidator, postController.createPost);
router.get('/get-posts', auth, postController.getPosts);
router.post('/delete-post', auth, deletePostValidator, postController.deletePost);
router.post('/update-post', auth, updatePostValidator, postController.updatePost);


//user routes
router.post('/create-user', auth, createUserValidator, userController.createUser);
router.get('/get-users', auth, createUserValidator, userController.getUsers);
router.post('/update-user', auth, updateUserValidator, userController.updateUser);
router.post('/delete-user', auth, deleteUserValidator, userController.deleteUser);




// like route
router.post('/post-like', auth, postLikeUnlikeValidator, likeController.postLike);
router.post('/post-unlike', auth, postLikeUnlikeValidator, likeController.postUnLike);
router.post('/post-like-count', auth, postLikeCountValidator, likeController.postLikeCount);


module.exports = router




