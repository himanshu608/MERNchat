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

const { Message, groupPic, roomIdPerUser } = require('./mongo');
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

app.get("/groupPics/:id", (req, res) => {
    groupPic.find({ roomId: req.params.id }, (err, data) => {
        if (err) {
            console.log(err.message);
            res.status(500).send("an error occurred")
        }
        else {
            // console.log((data[0].img));
            res.status(200).send(data)
        }
    })
})

app.get('/messages/delete', (req, res) => {
    Message.deleteMany({}, (err, data) => {
        if (err) console.log(err.message)
        else {
            console.log(data)
            res.send("deleted");
        }
    })
})

app.post('/groupPicUpload/:id', function (req, res) {
    console.log(req.body)
    var newImg = {
        roomId: req.body.roomId,
        userChanged: req.body.userChanged,
        img: req.body.img
    }
    groupPic.findOneAndUpdate({ roomId: req.params.id }, { userChanged: req.body.userChanged, img: req.body.img }, (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (data === null) {
                groupPic.create(newImg, (err, data) => {
                    if (err) {
                        res.status(500).send(err.message);
                        console.log(err.message)
                    }
                    else {
                        res.status(200).end()
                        console.log("image created");
                    }
                })
            } else {
                console.log("image saved");
                res.status(200).end()
            }
        }
    })


});


app.get("/roomidperuser/:id", (req, res) => {
    roomIdPerUser.find({ email: req.params.id }, (err, data) => {
        if (err) res.status(500).send(err.message);
        else {
            res.status(200).send(data);
        }
    })
})


app.get('/exitgroup', (req, res) => {

    roomIdPerUser.find({ email: req.query.user }, (err, data) => {
        if (err) res.status(500).send(err.message);
        else {
            if (data.length == 0) {
                console.log("user not found")
                res.send("user not found");
            } else {
                const i = data[0].rooms.indexOf(req.query.room);
                if (i > -1) data[0].rooms.splice(i, 1);
                roomIdPerUser.findOneAndUpdate({ email: req.query.user }, { rooms: [...data[0].rooms] }, { new: true }, (err, data) => {
                    if (err) res.status(500).send(err.message);
                    else {
                        // console.log(data);
                        res.send(data);
                    }
                })
            }
        }
    })
})

app.get('/isUserPresent/:id', (req, res) => {
    roomIdPerUser.find({ email: req.params.id }, (err, data) => {
        if (err) res.status(500).send(err.message);
        else res.status(200).send(data);
    })
})

app.post("/roomidadd", (req, res) => {
    const roomsids = {
        email: req.body.email,
        username: req.body.username,
        rooms: req.body.rooms,
    }
    roomIdPerUser.find({ email: req.body.email }, (err, data) => {
        if (err) res.status(500).send(err.message);
        else {
            if (data.length == 0) {
                roomIdPerUser.create(roomsids, (err, data) => {
                    if (err) res.status(500).send(err.message);
                    else {
                        // console.log("new room created");
                        res.status(200).send(data);
                    }
                })
            } else {
                var ispres = false;

                data[0].rooms.map(rm => {
                    if (rm == req.body.rooms) ispres = true;
                })
                if (!ispres) {
                    roomIdPerUser.findOneAndUpdate({ email: req.body.email }, { rooms: [...data[0].rooms, req.body.rooms] }, { new: true }, (err, data) => {
                        if (err) res.status(500).send(err.message);
                        else {
                            // console.log("new room added");
                            res.status(200).send(data);
                        }
                    })
                }
            }
        }
    })
})



//socket io connection
io.on('connection', (socket) => {
    var roomid, username;
    // var room,user;
    socket.on('disconnect', () => {
        console.log("connection closed");
    })
    socket.on("new-join", ({ user, room }) => {
        socket.join(room);
        roomid = room;
        username = user;
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