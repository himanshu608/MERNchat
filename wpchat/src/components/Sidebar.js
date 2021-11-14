import React, { useState, useEffect } from 'react'
import './sidebar.css';
import { Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SearchIcon from '@mui/icons-material/Search';
import Contacts from './Contacts';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from 'react-router';


function Sidebar({ name, room  }) {
    const [grpSrc, setGrpSrc] = useState();
    const [newRoomId, setNewRoomId] = useState();
    const [joinedRooms, setJoinedRooms] = useState([room]);
    const location = useLocation();
    function sideHide() {
        document.querySelector('.sidebar-header-right-responsive').classList.toggle('hide');
    }

    useEffect(() => {
        fetch(`http://localhost:5000/roomidperuser/${name}`).then(res => {
            return res.text();
        }).then(data => {
            data = JSON.parse(data)
            if(data.length===0){
                console.log("new user")
            }else{
                if(data[0].rooms.length == 0){
                    document.querySelector('.zero-rooms-div').classList.add('hide');
                    setTimeout(()=>{
                        document.querySelector('.exitbtnn').click();
                    },2500)
                }
                setJoinedRooms(data[0].rooms);
            }
        })
        
    }, [location])


    useEffect(() => {
        fetch('http://localhost:5000/groupPics').then(res => {
            return res.text();
        }).then(data => {
            data = JSON.parse(data)
            data.map(i => {
                if (i.roomId === room) {
                    const ig = `data:${i.img.contentType};base64,${Buffer.from(i.img.data).toString('base64')}`
                    setGrpSrc(ig);
                }
            })

        })
            .catch(err => { console.log(err); });
    }, [])


    function newRoomJoin() {
        
        var ispre=false;
        joinedRooms.map(rm=>{
            if(rm == newRoomId) {
                ispre = true;
            }
        })
        if(!ispre) {
            const setrooms = async () => {
                await setJoinedRooms(prev => [...prev, newRoomId]);
                
             }
             setrooms();
             document.querySelector('#newrmid').value = "";
             // const data = {username : name ,rooms:newRoomId};

            fetch('http://localhost:5000/roomidadd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username : name ,rooms:newRoomId})
            })
        }else{
            document.querySelector('#newrmid').value = "";
            alert("room already joined!")
        }
        
    }

    function dosomee(){
        window.location.href = "http://localhost:3000/"
    }
    return (
        <>
        <div className="zero-rooms-div">
            <div className="container-fluid bg-bg-primary d-grid justify-content-center  my-auto zero-rooms-div-info">
                    <h1 className="text-white">Please Join a room to Enter ...</h1>
                    <IconButton sx={{ color: "white",top:"10vh" }}>
                        <a href="/"><HomeIcon /></a>
                    </IconButton>
                    <button className="exitbtnn" onClick={dosomee}></button>
            </div>
        </div>

        <div className="sidebar">
                    <div className="sidebar-heading">
                        <div className="sidebar-header-left">
                            <Avatar src={"https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png"} sx={{ width: 50, height: 50 }} />
                            <h1>{name}</h1>
                        </div>
                        <div className="sidebar-header-right">

                            <IconButton sx={{ color: "white" }} onClick={sideHide}>
                                <MoreVertIcon />
                            </IconButton>
                            <div className="sidebar-header-right-responsive">
                                <IconButton sx={{ color: "white" }} >
                                    <ChatIcon />
                                </IconButton>
                                <IconButton sx={{ color: "white" }} >
                                    <DonutLargeIcon />
                                </IconButton>
                                <IconButton sx={{ color: "white" }} >
                                    <a href="/" style={{ color: "white" }}><LogoutIcon /></a>
                                </IconButton>
        
                            </div>
                        </div>
                    </div>
                    <div className="join-new-room">
                        <input id="newrmid" onChange={e => setNewRoomId(e.target.value)} type="text" placeholder="room id"></input>
                        <button className="px-3" onClick={newRoomJoin}>Join</button>
                    </div>
                    <div className="sidebar-search">
                        <IconButton >
                            <SearchIcon className="icons" />
                        </IconButton>
                        <input type="text" placeholder="search for messages"></input>
                    </div>
                    <div className="sidebar-new-join">

                    </div>
                    <div className="sidebar-contacts" >
                        {joinedRooms.map((rm) => {
                            return (
                                <Contacts name={name} room={rm}></Contacts>
                            )
                        })}
                    </div>
        </div>
        </>
    )
}

export default Sidebar
