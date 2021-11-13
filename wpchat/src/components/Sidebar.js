import React from 'react'
import './sidebar.css';
import {Link} from 'react-router-dom';
import {Avatar, IconButton} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SearchIcon from '@mui/icons-material/Search';
import Contacts from './Contacts';
import LogoutIcon from '@mui/icons-material/Logout';
function Sidebar({name , room}) {
    function sideHide(){
        document.querySelector('.sidebar-header-right-responsive').classList.toggle('hide');
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
                    </div>
                </div>
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
                <Contacts room={room} />
                {/* <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts />
                <Contacts /> */}
            </div>
        </div>
    )
}

export default Sidebar
