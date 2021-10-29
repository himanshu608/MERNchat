import React, { useState, useEffect } from 'react'
import './chat.css';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';

function Chat({ user, room, socket }) {

    const [roomName, setRoomName] = useState("");
    const [newMsg, setNewMsg] = useState("");
    const [messages, setMessages] = useState([]);
    useEffect(() =>{
        socket.emit("new-join",{user, room});
    },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/messages/sync")
                const data = await res.json()
                setMessages(data);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData()
        setRoomName(room);
    }, [room])
    useEffect(() => {
        socket.on("new-msg", (msg) => {
            msg.recived = true;
            setMessages(m => [...m, msg]);
        })
        console.log("running")
    }, [socket])

    const dosome = (e) => {
        if (e.keyCode === 13) {
            e.target.value = "";
            var hours = new Date().getHours();
            var minutes = new Date().getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            const msg = {
                user: user,
                message: newMsg,
                time: strTime,
            }
            socket.emit("new-msg", msg);
            setMessages(m => [...m, msg]);
        }
    }
    return (
        <div className="chat">
            <div className="chat-header">
                <div className="chat-header-left">
                    <Avatar sx={{ width: 50, height: 50 }} />
                    <div className="chat-header-middle">
                        <h2>{roomName}</h2>
                        <h6>last Seen</h6>
                    </div>
                </div>
                <div className="chat-header-right">
                    <IconButton>
                        <CameraAltIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat-message-container">

                {messages.map((data) => {
                    return (
                        <p className={`chat-message  ${data.user !== user ? '' : ' chat-message-send'}`} >
                            <span className="chat-message-username">{data.user}</span>
                            {data.message}
                            <span className="chat-message-timestamp">{data.time}</span>
                        </p>
                    )
                })}

            </div>
            <div className="chat-footer">
                <div className="chat-footer-left">
                    <IconButton>
                        <EmojiEmotionsIcon className="icons" />
                    </IconButton>
                    <input onChange={(e) => setNewMsg(e.target.value)} onKeyUp={dosome} type="text" placeholder="new message" id="msg-input"></input>
                </div>
                <IconButton>
                    <MicIcon className="icons" />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
