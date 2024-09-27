const mongoose = require('mongoose');
const permissionSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    permissions: [
        {
            permission_name: String,
            permission_value: [Number], // 0->Create , 1->Read , 2-> Update , 3->Delete
        }
    ],
  

})

module.exports = mongoose.model('Permission',permissionSchema);

// [
    // {
    //     permission_name: 'Post',
    //     permission_value: [0,1,2], // 0->Create , 1->Read , 2-> Update , 3->Delete
    // },
    // {
    //     permission_name: 'Category',
    //     permission_value: [0,1], // 0->Create , 1->Read , 2-> Update , 3->Delete
    // },
// ]