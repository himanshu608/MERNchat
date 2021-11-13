import React,{ useState, useEffect} from 'react'
import './sidebar.css';
import {Link} from 'react-router-dom';
import {Avatar, IconButton} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SearchIcon from '@mui/icons-material/Search';
import Contacts from './Contacts';
import LogoutIcon from '@mui/icons-material/Logout';
import AddBoxIcon from '@mui/icons-material/AddBox';

function Sidebar({name , room}) {
    const [grpSrc,setGrpSrc]= useState();
    const [newRoomId,setNewRoomId]= useState();
    const [joinedRooms,setJoinedRooms] = useState([room]);

    function sideHide(){
        document.querySelector('.sidebar-header-right-responsive').classList.toggle('hide');
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
    },[])
    function newRoomJoin(){
        setJoinedRooms(prev=> [...prev,newRoomId]);
        document.querySelector('#newrmid').value="";
    }
    return (
        <div className="sidebar">
            <div className="sidebar-heading">
                <div className="sidebar-header-left">
                <Avatar src={"https://cdn.icon-icons.com/icons2/2643/PNG/512/male_boy_person_people_avatar_icon_159358.png"} sx={{ width: 50, height: 50 }} />
                <h1>{name}</h1>
                </div>
                <div className="sidebar-header-right">
                    
                    <IconButton sx={{color:"white"}} onClick={sideHide}>
                        <MoreVertIcon/>
                    </IconButton>
                    <div className="sidebar-header-right-responsive">
                        <IconButton sx={{color:"white"}} >
                            <ChatIcon/>
                        </IconButton>
                        <IconButton sx={{color:"white"}} >
                            <DonutLargeIcon/>
                        </IconButton>
                        <IconButton sx={{color:"white"}} >
                            <a href="/" style={{color:"white"}}><LogoutIcon /></a>
                        </IconButton>
                        <IconButton sx={{color:"white"}}>
                            <AddBoxIcon />
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className="join-new-room">
                <input id="newrmid" onChange={e=>setNewRoomId(e.target.value)} type="text" placeholder="room id"></input>
                <button className="px-3" onClick={newRoomJoin}>Join</button>
            </div>
            <div className="sidebar-search">
                <IconButton >
                    <SearchIcon className="icons"/>
                </IconButton>
                <input type="text" placeholder="search for messages"></input>
            </div>
            <div className="sidebar-new-join">
                
            </div>
            <div className="sidebar-contacts" >
                {/* <Contacts  name={name} room={"1234"} src={grpSrc}/>
                <Contacts name={name} room={"2555"} src={grpSrc}/> */}
                {joinedRooms.map((rm)=>{
                    return (
                        <Contacts name={name} room={rm}></Contacts>
                    )
                })}
            </div>
        </div>
    )
}

export default Sidebar
