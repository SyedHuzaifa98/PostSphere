const express = require('express');
const router = express();
const auth = require('../middlewares/authMiddleware');
const { categoryAddValidator, categoryDeleteValidator,categoryUpdateValidator ,createPostValidator} = require('../helpers/adminValidator');
const categoryController = require('../controllers/categoryController');
const postController = require('../controllers/postController');


// category routes
router.post('/add-category', auth, categoryAddValidator, categoryController.addCategory);
router.get('/get-categories', auth, categoryController.getCategories);
router.post('/delete-category', auth, categoryDeleteValidator, categoryController.deleteCategory);
router.post('/update-category', auth, categoryUpdateValidator, categoryController.updateCategory);


// post routes
router.post('/create-post', auth, createPostValidator, postController.createPost);
router.get('/get-posts', auth, postController.getPosts);


module.exports = router




