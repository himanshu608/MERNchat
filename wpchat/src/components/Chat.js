import React, { useState, useEffect, useContext } from 'react'
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
import { Link, useHistory, useLocation, Redirect } from "react-router-dom";
import { ClapSpinner } from "react-spinners-kit";
import SendIcon from '@mui/icons-material/Send';
import HomeIcon from '@mui/icons-material/Home';
import AuthContext from '../contexts/AuthContext'
import Camera from 'react-html5-camera-photo';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import 'react-html5-camera-photo/build/css/index.css';

import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ['websocket', 'polling', 'flashsocket'] })



function Chat({ user, room }) {

    const history = useHistory();
    const location = useLocation();
    if (location.search === '') {
        history.push('/join')
    }
    const [roomName, setRoomName] = useState("");
    const [newMsg, setNewMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [chatwidth, setChatwidth] = useState();
    const [grpSrc, setGrpSrc] = useState();
    const [grpImgType, setGrpImgType] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const [tempMsg, setTempMsg] = useState("");
    const [cameraImgSrc, setCameraImgSrc] = useState(null);
    const [isCameraOff,setIsCameraOff] = useState(true);
    const [chatAnim, setChatAnim] = useState(true);
    const [isImage, setIsImage] = useState(false);
    const [imageName, setImageName] = useState();
    const [imgData, setImgData] = useState();
    const [mimeType, setMimetype] = useState("");
    const [joinedRooms, setJoinedRooms] = useState([room]);
    const { currentUser } = useContext(AuthContext);

    const onEmojiClick = (event, emojiObject) => {
        setTempMsg(prevInput => prevInput + emojiObject.emoji);
        setNewMsg(prevInput => prevInput + emojiObject.emoji);
        // setShowPicker(false);
        document.querySelector('#msg-input').focus();
    };
    useEffect(() => {
        socket.emit("new-join", { user, room });
        setChatwidth(document.querySelector('.chat-message-container').offsetWidth)
        return () => {
            if (socket) socket.disconnect();
        }
    }, [])

    function dosomee() {
        window.location.href = "http://localhost:3000/join"
    }

    useEffect(() => {
        if (currentUser) {
            fetch(`http://localhost:5000/roomidperuser/${currentUser.email}`).then(res => { //get room ids for current user
                return res.text();
            }).then(data => {
                data = JSON.parse(data)
                if (data.length === 0) {
                    console.log("new user")
                } else {
                    // if(data[0].rooms.length === 0){
                    //     document.querySelector('.zero-rooms-div').classList.add('hide');
                    //     // setTimeout(()=>{
                    //     //     document.querySelector('.exitbtnn').click();
                    //     // },2500)
                    // }
                    setJoinedRooms(data[0].rooms);
                }
            }).catch(err => console.log(err.message));
        }
    }, [currentUser])









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
            setMessages(m => [...m, msg]);
        })
    }, [])

    useEffect(() => {

        fetch(`http://localhost:5000/groupPics/${room}`).then(res => {
            return res.text();
        }).then(data => {
            data = JSON.parse(data)

            data.map(i => {
                if (i.roomId === room) {
                    setGrpSrc(i.img.data)
                }
            })

        })
            .catch(err => { console.log(err); });
    }, [location])

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
        setChatAnim(false)
        setShowPicker(false)
        if (e.keyCode === 13 && e.target.value !== "") {
            setTempMsg("");
            const strTime = getTime();
            const msg = {
                email: currentUser.email,
                roomId: room,
                user: user,
                message: newMsg,
                time: strTime,
                isImage: false,
                imageData: {
                    imageName: "",
                    data: "",
                    imageType: ""
                }
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

    function scrollToBottom() {
        document.querySelector('.div-to-show').scrollIntoView({ behavior: "smooth" });
    }
    function tog() {
        document.querySelector('.cameradiv').classList.toggle('swipe');
        setIsCameraOff(pre=>!pre);
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
        var input = document.querySelector('#changeGrp')

        e.preventDefault();
        if (input.files.length !== 0) {
            const data = {
                roomId: room,
                userChanged: currentUser.email,
                img: {
                    data: grpSrc,
                    contentType: grpImgType
                }
            }
            fetch(`http://localhost:5000/groupPicUpload/${room}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).catch(err => { console.log(err); })
        }

        groupPicHide();


    }

    function changeMe(input) {
        if (input.target.files[0].type.match('^image')) {
            setGrpImgType(input.target.files[0].type)
            if (FileReader) {
                var reader = new FileReader();
                reader.readAsDataURL(input.target.files[0]);
                reader.onload = function (e) {
                    setGrpSrc(e.target.result);
                }
            }
        }
    }


    function exitGroup() {
        fetch(`http://localhost:5000/exitgroup?user=${currentUser.email}&&room=${room}`)
            .then(response => { return response.text() })
            .then(response => {
                response = JSON.parse(response)
                if (response.rooms.length === 0) {
                    document.querySelector('.zero-rooms-div').classList.add('hide');
                    setTimeout(() => {
                        document.querySelector('.exitbtnn').click();
                    }, 2500)
                } else history.push(`/chat?room=${response.rooms[0]}&&name=${user}`)
            })
            .catch(err => { console.log(err); });
    }


    function hideSendFilePreview() {
        document.querySelector('#file1').value = ''
        document.querySelector('.send-files').classList.add('hide');
        document.querySelector('.preview-div').classList.add('hide');
    }

    function previewSendFiles(e) {
        console.log('hello')
        document.querySelector('.send-files').classList.remove('hide');
        document.querySelector('.preview-div').classList.remove('hide');
        console.log(e.target.files[0])
        document.querySelector('.preview-div').innerHTML = '';
        if (e.target.files[0].type.match('^image')) {
            setIsImage(true);
            setImageName(e.target.files[0].name)
            setMimetype(e.target.files[0].type)
            if (FileReader) {
                var reader = new FileReader();
                reader.readAsDataURL(e.target.files[0]);
                reader.onload = function (e) {
                    setImgData(e.target.result);
                    var image = document.createElement('img');
                    image.style.cssText = 'width: 100%;height: 100%';
                    image.src = e.target.result;
                    document.querySelector('.preview-div').appendChild(image);
                }
            }
        } else {

            var div1 = document.createElement('div');
            var div2 = document.createElement('div');
            var span = document.createElement('span');
            var image = document.createElement('img');
            image.style.cssText = 'width: 100%;height: 100%';

            if (e.target.files[0].type.match('^video')) {
                image.src = 'https://image.freepik.com/free-vector/video-upload-concept-illustration_114360-6773.jpg'
            } else image.src = 'https://image.freepik.com/free-vector/concept-image-upload-landing-page_23-2148319404.jpg'
            div1.classList.add('file-prev');
            div1.appendChild(image);
            span.innerHTML = e.target.files[0].name;
            div2.classList.add('info');
            div2.appendChild(span);
            document.querySelector('.preview-div').appendChild(div1);
            document.querySelector('.preview-div').appendChild(div2);

        }
    }

    function sendImage() {
        setShowPicker(false)
        setChatAnim(false)
        if (isImage) {
            setTempMsg("");
            const strTime = getTime();
            const msg = {
                emai: currentUser.email,
                roomId: room,
                user: user,
                message: "",
                time: strTime,
                isImage: true,
                imageData: {
                    imageName: imageName,
                    data: imgData,
                    imageType: mimeType
                }
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
        document.querySelector('#file1').value = ''
        document.querySelector('.send-files').classList.add('hide');
        document.querySelector('.preview-div').classList.add('hide');
    }

    function handleTakePhoto(dataUri) {
        setCameraImgSrc(dataUri);
        setIsCameraOff(true)
    }

    function retakePhoto() {
        setCameraImgSrc(null);
        setIsCameraOff(false)
    }
    function sendClicked(){
        if(cameraImgSrc){
            tog();
            setShowPicker(false)
            setChatAnim(false)
            setIsCameraOff(true);
            setTempMsg("");
            const strTime = getTime();
            const msg = {
                emai: currentUser.email,
                roomId: room,
                user: user,
                message: "",
                time: strTime,
                isImage: true,
                imageData: {
                    imageName: 'clickedimage.jpg',
                    data: cameraImgSrc,
                    imageType: 'image/png'
                }
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
    function handleCameraError() {
        tog();
        alert('unable to start camera')
    }
    return (
        <>
            <div className="zero-rooms-div">
                <div className="container-fluid bg-bg-primary d-grid justify-content-center  my-auto zero-rooms-div-info">
                    <h1 className="text-white">Please Join a room to Enter ...</h1>
                    <IconButton sx={{ color: "white", top: "10vh" }}>
                        <a href="/"><HomeIcon /></a>
                    </IconButton>
                    <button className="exitbtnn" onClick={dosomee}></button>
                </div>
            </div>
            <div className="send-files hide">
                <div className="preview-div hide">

                </div>
                <div className="sendorcanc">
                    <IconButton sx={{ color: "white", backgroundColor: 'crimson' }} onClick={hideSendFilePreview}>
                        <CloseIcon />
                    </IconButton>
                    <IconButton sx={{ color: "white", backgroundColor: 'crimson' }} onClick={sendImage}>
                        <SendIcon />
                    </IconButton>
                </div>
            </div>
            <div className="groupPic-div">
                <IconButton sx={{ color: "white" }} className="groupPic-div-crossicon" onClick={groupPicHide}  >
                    <CloseIcon />
                </IconButton>
                <div className="group-pic-image">
                    <img src={grpSrc} id="gpicImg"></img>
                </div>

                <div className="change-grouPic">

                    <input type="file" id="changeGrp" onChange={changeMe} accept="image/png, image/jpeg"></input>
                    <button onClick={changeGroupPic} type="button" className="">Change<span></span></button>

                </div>
            </div>

            <div className="chat">

                <div className="cameradiv">
                    <IconButton onClick={tog} sx={{ backgroundColor: "black", color: "white", margin: "10px", width: '40px' }}>
                        <CloseIcon />
                    </IconButton>
                    {
                        isCameraOff ?
                            <div className="container d-flex flex-column text-center justify-content-center align-items-center">
                                <img src={cameraImgSrc}></img>
                                <div className="send-or-retake d-flex flex-row w-50 justify-content-around mt-3">
                                    <IconButton onClick={retakePhoto} sx={{ color: "white", width: '40px', backgroundColor: 'black' }}>
                                        <AutorenewIcon />
                                    </IconButton>
                                    <IconButton onClick={sendClicked} sx={{ color: "white", width: '40px', backgroundColor: 'black' }}>
                                        <SendIcon />
                                    </IconButton>
                                </div>
                            </div>
                            :
                            <Camera  onCameraError = { (error) => { handleCameraError(error); } } onTakePhotoAnimationDone={(dataUri) => { handleTakePhoto(dataUri); }}
                            />
                    }
                </div>
                <div className="chat-header">
                    <div className="chat-header-left">
                        <IconButton onClick={groupPicHide}>
                            <Avatar src={grpSrc} sx={{ width: 50, height: 50 }} />
                        </IconButton>
                        <div className="chat-header-middle">
                            <h2>{roomName}</h2>
                            <h6>last Seen</h6>
                        </div>
                    </div>
                    <div className="chat-header-right">
                        <div className="cht">
                            <IconButton sx={{ color: "white" }} onClick={tog}>
                                <CameraAltIcon />
                            </IconButton>
                            <IconButton sx={{ color: "white" }} onClick={openFileOption}>
                                <AttachFileIcon />
                            </IconButton>
                            {/* <IconButton sx={{color:"white"}} onClick={openChatOption}>
                        <MoreVertIcon  />
                    </IconButton> */}
                            <Link to={`/chat?name=${user}&&room=${room}`} ><IconButton onClick={exitGroup} sx={{ color: "white" }}>
                                <ExitToAppIcon />
                            </IconButton></Link>
                            <input type="file" id="file1" style={{ display: "none" }} accept="image/png, image/gif, image/jpeg" onChange={previewSendFiles}></input>
                        </div>

                        <div className="chat-header-right-options">
                            <IconButton sx={{ color: "white" }} onClick={tog} >
                                <CameraAltIcon />
                            </IconButton>
                            <IconButton sx={{ color: "white" }} onClick={openFileOption}>
                                <AttachFileIcon />
                            </IconButton>
                            <Link to={`/chat?name=${user}&&room=${room}`} ><IconButton onClick={exitGroup} sx={{ color: "white" }}>
                                <ExitToAppIcon />
                            </IconButton></Link>
                        </div>

                    </div>
                    <div className="chat-header-right-responsive">
                        <IconButton sx={{ color: "white" }} onClick={openChatOption}>
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                </div>

                <div onScroll={hidebutn} className="chat-message-container">

                    {chatAnim ? <div className="chatLoad"><ClapSpinner /></div> : messages.map((data) => {
                        if (data.roomId === room) {
                            if (!data.isImage) {
                                return (
                                    <p key={(data._id ? data._id : Math.random())} className={`chat-message  ${data.user !== user ? '' : ' chat-message-send'}`} >
                                        <span className="chat-message-username">{data.user}</span>
                                        {data.message}
                                        <span className="chat-message-timestamp">{data.time}</span>
                                    </p>
                                )
                            } else {
                                return (
                                    <div className={`${data.user !== user ? 'image-div-recv' : 'image-div'}`} key={(data._id ? data._id : Math.random())}>
                                        <span>{data.user}</span>
                                        <img src={data.imageData.data}></img>
                                        <span>{data.time}</span>
                                    </div>
                                )
                            }
                        } else {
                            return <h1 key={Math.random()}></h1>
                        }

                    })}
                    <div className="div-to-show"></div>
                    <i onClick={scrollToBottom} style={{ left: `${chatwidth}` }} className="float-button" >
                        <IconButton> <KeyboardArrowDownIcon sx={{ color: "white", width: "20px", height: "20px" }} /></IconButton>
                    </i>



                </div>
                <div className="emoji-show-div d-flex justify-content-center">
                    {showPicker && <Picker
                        pickerStyle={{ width: '70%' }}
                        onEmojiClick={onEmojiClick} />}
                </div>
                <div className="chat-footer">
                    <div className="chat-footer-left">
                        <IconButton sx={{ color: "white" }} onClick={() => setShowPicker(val => !val)}>
                            <EmojiEmotionsIcon className="icons" />
                        </IconButton>
                        <input value={tempMsg} onChange={(e) => { setTempMsg(e.target.value); setNewMsg(e.target.value) }} onKeyUp={dosome} type="text" placeholder="new message" id="msg-input"></input>

                    </div>
                    <IconButton sx={{ color: "white" }} className="micIcn">
                        <MicIcon className="icons" />
                    </IconButton>

                </div>
            </div>
        </>
    )
}

export default Chat
