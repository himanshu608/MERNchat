const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const PORT = process.env.PORT || 5000;
const io = new Server(server);
const cors = require('cors');
const bp = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()
const path = require('path');
const fs = require('fs');

//multer

var multer = require('multer')

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (request, file, callback) {
        callback(null, 'images.png')
    }
});

var upload = multer({ storage: storage });

//database
const url = `mongodb+srv://${process.env.ID}:${process.env.PASS}@cluster0.tnd4e.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

mongoose.connect(url).then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err.message);
})

const {Message,groupPic} = require('./mongo');
//---------------------------------------------------------------- //


//middleware

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

//Routes
app.get('/', (req, res) => {
    res.send("hello server!");
})
app.get('/messages/sync', (req, res) => {
    Message.find((err, data) => {
        if (err) {
            console.log(err.message);
            res.send(err.message);
        } else {
            res.send(data);
        }
    })
})

app.get("/groupPics",(req, res) => {
    groupPic.find({}, (err, data) => {
        if(err) {console.log(err.message);
        res.status(500).send("an error occurred")}
        else{
            // console.log((data[0].img));
            res.status(200).send(data)
        }
    })
})

app.get('/messages/delete', (req, res) => {
    Message.deleteMany({}, (err, data) => {
        if(err) console.log(err.message)
        else{
            console.log(data)
            res.send("deleted");
        }
    })
})

app.post('/groupPicUpload/:id', upload.single('image'), function (req, res) {
    var newImg = {
        roomId:req.body.room,
        img : {
            data: fs.readFileSync(path.join(__dirname + '/uploads/images.png')),
            contentType: 'image/png'
        }
    }
    groupPic.deleteMany({roomId:req.params.id}, (err, data)=>{
        if (err) console.log(err.message);
        else{
            groupPic.create(newImg,(err, data)=>{
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("image saved");
                }
            })
        }
    })
    
    res.status(204).end()
});





//socket io connection
io.on('connection', (socket) => {
    var roomid,username;
    // var room,user;
    socket.on('disconnect', () => {
        console.log("connection closed");
    })
    socket.on("new-join", ({user,room}) => {
        socket.join(room);
        roomid=room;
        username=user;
        console.log("new joined");
    })
    socket.on("new-msg", (msg) => {
        socket.to(roomid).emit('new-msg', msg);
        Message.create(msg, (err, data) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("data sent to database")
            }
        })
    })
})






server.listen(PORT, () => {
    console.log("listening on port " + PORT);
});