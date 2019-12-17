const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },
    nickname: {
        type: String,
        default: '游客'
    },
    level: {
        type: Number,
        default: 0
    },

});




module.exports = {
    userSchema
};





