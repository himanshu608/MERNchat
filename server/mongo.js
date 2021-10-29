const mongoose = require('mongoose');


const Message = mongoose.Schema({
    user: String,
    message: String,
    time:String,
});

module.exports = mongoose.model('messagedata', Message);