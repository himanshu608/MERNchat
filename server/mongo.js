const mongoose = require('mongoose');


const Message = mongoose.Schema({
    
    roomId:String,
    user: String,
    message: String,
    time:String,
    isImage:Boolean,
    imageData:{
        imageName:String,
        data:String,
        imageType:String,
    }
});

const groupPic = mongoose.Schema({
    roomId:String,
    userChanged:String,
    img : {
        data: String,
        contentType: String
    }
})

const roomIdPerUser = mongoose.Schema({
    username:String,
    rooms:[String],
})

module.exports = {Message: mongoose.model('messagedata', Message) , groupPic : mongoose.model('groupsImg',groupPic) , roomIdPerUser : mongoose.model('roomIdPerUser',roomIdPerUser)};