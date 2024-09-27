const mongoose = require('mongoose');
const likeSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Post' // ref is like foreing key in relational DB
    },
  

})

module.exports = mongoose.model('Like',likeSchema);
