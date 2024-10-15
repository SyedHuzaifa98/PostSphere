const mongoose = require('mongoose');

const routePermissionSchema = new mongoose.Schema({
    router_endpoint: {
        type: String,
        required: true
    },
    role: {
        type: Number, // 0,1,2,3
        required: true, 
    },
    permission:{
        type:Number, // 0,1,2,3
        required:true
    }


});


module.exports = mongoose.model('RoutePermission', routePermissionSchema);