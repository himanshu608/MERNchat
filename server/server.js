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

//database
const url = `mongodb+srv://${process.env.ID}:${process.env.PASS}@cluster0.tnd4e.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

mongoose.connect(url).then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(err.message);
})

const Message = require('./mongo');
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

app.get('/messages/delete', (req, res) => {
    Message.deleteMany({}, (err, data) => {
        if(err) console.log(err.message)
        else{
            console.log(data)
            res.send("deleted");
        }
    })
})

//socket io connection
io.on('connection', (socket) => {
    var roomid,username;
    console.log("connection established",socket.id);
    // var room,user;
    socket.on('disconnect', () => {
        console.log("connection closed");
    })
    socket.on("new-join", ({user,room}) => {
        socket.join(room);
        roomid=room;
        username=user;
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