const mongoose = require('mongoose');


const Message = mongoose.Schema({
    roomId:String,
    user: String,
    message: String,
    time:String,
});

module.exports = mongoose.model('messagedata', Message);