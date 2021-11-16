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
import Picker from 'emoji-picker-react';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useHistory ,useLocation } from "react-router-dom";
import { ClapSpinner } from "react-spinners-kit";

import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ['websocket', 'polling', 'flashsocket'] })

function Chat({ user, room }) {
    const [roomName, setRoomName] = useState("");
    const [newMsg, setNewMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const inp = useRef();
    const [chatwidth, setChatwidth] = useState();
    const [grpSrc , setGrpSrc] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const [tempMsg, setTempMsg] = useState("");
    const history = useHistory();
    const location = useLocation();
    const [chatAnim,setChatAnim] = useState(true);
    const onEmojiClick = (event, emojiObject) => {
        setTempMsg(prevInput => prevInput + emojiObject.emoji);
        setNewMsg(prevInput => prevInput + emojiObject.emoji);
        // setShowPicker(false);
        document.querySelector('#msg-input').focus();
      };
    useEffect(() => {
        socket.emit("new-join", { user, room });
        setChatwidth(document.querySelector('.chat-message-container').offsetWidth)
        return ()=> {
             if(socket) socket.disconnect();
        }
    },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:5000/messages/sync")
                const data = await res.json()
                setMessages(data);
                setChatAnim(false);
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
        setShowPicker(false)
        if (e.keyCode === 13 && e.target.value !== "") {
            setTempMsg("");
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
            setNewMsg("");
            addNew().then((res) => {
                scrollToBottom();
            });
        }
    }

    // function doIt(){
    //         const strTime = getTime();
    //         const msg = {
    //             roomId: room,
    //             user: user,
    //             message: newMsg,
    //             time: strTime,
    //         }
    //         socket.emit("new-msg", msg);
    //         const addNew = async () => {
    //             await setMessages(m => [...m, msg]);
    //             return true;
    //         }
    //         addNew().then((res) => {
    //             scrollToBottom();
    //         });
    // }
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
    function openChatOption() {
        document.querySelector('.chat-header-right-options').classList.toggle('hide');
    }
    function groupPicHide() {
        document.querySelector('.groupPic-div').classList.toggle('hide');
    }
    function changeGroupPic(e) {
        e.preventDefault();
        var input = document.querySelector('#changeGrp')

        var data = new FormData()
        data.append('image', input.files[0])
        data.append('user', user)
        data.append('room', room)

        fetch(`http://localhost:5000/groupPicUpload/${room}`, {
        method: 'POST',
        headers: {
            enctype:"multipart/form-data"
        },
        body: data
        })
        if (FileReader)
	    {
		var reader = new FileReader();
		reader.readAsDataURL(input.files[0]);
		reader.onload = function (e) {
			setGrpSrc(e.target.result) ;
		}
	    }
        groupPicHide();
        
    }

    function changeMe(input){
        if (FileReader)
	    {
		var reader = new FileReader();
		reader.readAsDataURL(input.target.files[0]);
		reader.onload = function (e) {
			setGrpSrc(e.target.result) ;
		}
	    }
    }
    useEffect(() => {

        fetch('http://localhost:5000/groupPics').then(res => {
             return res.text();
         }).then(data => {
             data = JSON.parse(data)
             data.map(i=>{
                 if(i.roomId === room){
                    const ig =`data:${i.img.contentType};base64,${Buffer.from(i.img.data).toString('base64')}`
                    setGrpSrc(ig);
                 }
             })
             
         })
         .catch(err => {console.log(err);});
    },[location])

    function exitGroup(){
        fetch(`http://localhost:5000/exitgroup?user=${user}&&room=${room}`);
        history.goBack();
        console.log(history)
        document.querySelector('.chat-header-right-options').classList.toggle('hide');
    }

    function scrl(){
        document.querySelector('.micIcn').scrollIntoView();
    }
    
    return (
        <>
        <div className="groupPic-div"> 
            <IconButton sx={{color:"white"}} className ="groupPic-div-crossicon" onClick={groupPicHide}  >
                <CloseIcon />
            </IconButton>
            <div className="group-pic-image">
                <img src={grpSrc} id="gpicImg"></img>
            </div>

            <div className="change-grouPic">

               <input type="file" id="changeGrp" onChange={changeMe}></input>
                <button onClick={changeGroupPic} type="button" className="">Change<span></span></button>

            </div>
        </div>
        <div className="chat">
            <div className="cameradiv">
                <IconButton onClick={tog} sx={{ backgroundColor: "black", color: "white", margin: "10px" }}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className="chat-header">
                <div className="chat-header-left">
                    <IconButton  onClick={groupPicHide}> 
                    <Avatar src={grpSrc} sx={{ width: 50, height: 50 }} />
                    </IconButton>
                    <div className="chat-header-middle">
                        <h2>{roomName}</h2>
                        <h6>last Seen</h6>
                    </div>
                </div>
                <div className="chat-header-right">
                    <div className="cht">
                    <IconButton sx={{color:"white"}} onClick={tog}>
                        <CameraAltIcon />
                    </IconButton>
                    <IconButton sx={{color:"white"}} onClick={openFileOption}>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton sx={{color:"white"}} onClick={openChatOption}>
                        <MoreVertIcon  />
                    </IconButton>
                    <input type="file" multiple={true} id="file1" style={{ display: "none" }}></input>
                    </div>
                    <div className="chat-header-right-options">
                    <IconButton sx={{color:"white"}} onClick={tog} >
                        <CameraAltIcon />
                    </IconButton>
                    <IconButton sx={{color:"white"}} onClick={openFileOption}>
                        <AttachFileIcon />
                    </IconButton>
                    <Link to={`/chat?name=${user}&&room=${room}`} ><IconButton onClick={exitGroup} sx={{color:"white"}}>
                        <ExitToAppIcon />
                    </IconButton></Link>
                    </div>
                    
                </div>
                <div className="chat-header-right-responsive">
                    <IconButton sx={{color:"white"}} onClick={openChatOption}>
                        <MoreVertIcon  />
                    </IconButton>
                </div>
            </div>

            <div onScroll={hidebutn} className="chat-message-container">
                {chatAnim?<div className="chatLoad"><ClapSpinner /></div> : messages.map((data) => {
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
            <div className="emoji-show-div d-flex justify-content-center">
            {showPicker && <Picker
            pickerStyle={{ width: '70%'}}
             onEmojiClick={onEmojiClick} />}
            </div>
            <div className="chat-footer">
                <div className="chat-footer-left">
                    <IconButton sx={{color:"white"}} onClick={() => setShowPicker(val => !val)}>
                        <EmojiEmotionsIcon className="icons" />
                    </IconButton>
                    <input  value={tempMsg} onChange={(e) =>{setTempMsg(e.target.value);setNewMsg(e.target.value)}} onKeyUp={dosome} type="text" placeholder="new message" id="msg-input"></input>
                    
                </div>
                <IconButton sx={{color:"white"}} className="micIcn">
                    <MicIcon className="icons" />
                    </IconButton>
                    
            </div>
        </div>
        </>
    )
}

export default Chat
