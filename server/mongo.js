const mongoose = require('mongoose');


const Message = mongoose.Schema({
    roomId:String,
    user: String,
    message: String,
    time:String,
});

const groupPic = mongoose.Schema({
    roomId:String,
    img : {
        data: Buffer,
        contentType: String
    }
})

const roomIdPerUser = mongoose.Schema({
    username:String,
    rooms:[String],
})

module.exports = {Message: mongoose.model('messagedata', Message) , groupPic : mongoose.model('groupsImg',groupPic) , roomIdPerUser : mongoose.model('roomIdPerUser',roomIdPerUser)};