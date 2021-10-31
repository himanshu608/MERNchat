import React, { useState, useEffect, useRef } from 'react'
import './chat.css';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close';
function Chat({ user, room, socket }) {
    const [ul,setUl]= useState("");
    const [roomName, setRoomName] = useState("");
    const [newMsg, setNewMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const inp = useRef();
    const [chatwidth, setChatwidth] = useState();
    useEffect(() => {
        socket.emit("new-join", { user, room });
        setChatwidth(document.querySelector('.chat-message-container').offsetWidth)
    }, [])
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
    }, [])
    function getTime() {
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        var strTime = new Date().getDate() + ' ' + monthNames[new Date().getMonth()] + ' ' + hours + ':' + minutes + ' ' + ampm;

        return strTime;
    }
    const dosome = (e) => {
        if (e.keyCode === 13) {
            e.target.value = "";
            const strTime = getTime();
            const msg = {
                roomId: room,
                user: user,
                message: newMsg,
                time: strTime,
            }
            socket.emit("new-msg", msg);
            const addNew = async () => {
                await setMessages(m => [...m, msg]);
                return true;
            }
            addNew().then((res) => {
                scrollToBottom();
            });
        }
    }

    function scrollToBottom() {
        inp.current.scrollIntoView({ behavior: "smooth" });
    }
    function tog() {
        document.querySelector('.cameradiv').classList.toggle('swipe');
    }
    function openFileOption() {
        document.getElementById("file1").click();
    }

    function hidebutn() {
        document.querySelector('.float-button').classList.add('hidebtn');
        setTimeout(() => {
            document.querySelector('.float-button').classList.remove('hidebtn');
        }, 1000)
    }

    return (
        <div className="chat">
            <div className="cameradiv">
                <IconButton onClick={tog} sx={{ backgroundColor: "black", color: "white", margin: "10px" }}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="chat-header">
                <div className="chat-header-left">
                    <Avatar sx={{ width: 50, height: 50 }} />
                    <div className="chat-header-middle">
                        <h2>{roomName}</h2>
                        <h6>last Seen</h6>
                    </div>
                </div>
                <div className="chat-header-right">
                    <IconButton onClick={tog}>
                        <CameraAltIcon />
                    </IconButton>
                    <IconButton onClick={openFileOption}>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon  />
                    </IconButton>
                    <input type="file" multiple={true} id="file1" style={{ display: "none" }}></input>
                </div>
            </div>

            <div onScroll={hidebutn} className="chat-message-container">
                {messages.map((data) => {
                    if (data.roomId === room) {
                        return (
                            <p key={(data._id?data._id:Math.random())} className={`chat-message  ${data.user !== user ? '' : ' chat-message-send'}`} >
                                <span className="chat-message-username">{data.user}</span>
                                {data.message}
                                <span className="chat-message-timestamp">{data.time}</span>
                            </p>
                        )
                    } else {
                        return <h1 key={Math.random()}></h1>
                    }

                })}
                <div ref={inp}></div>
                <i onClick={scrollToBottom} style={{ left: `${chatwidth}` }} className="float-button" >
                    <IconButton> <KeyboardArrowDownIcon sx={{ color: "white", width: "20px", height: "20px" }} /></IconButton>
                </i>
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
