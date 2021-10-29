import React, { useState } from 'react'
import {Avatar} from '@mui/material';
import {Link} from 'react-router-dom';
import './join.css';

function Join() {
    const [username,setUsername] = useState("");
    const [roomid,setRoomid] = useState("");
    const stl = {
        color:"white",
        textDecoration: 'none',
        backgroundColor: "crimson",
        width: "100%",
        height:"50px",
        textAlign: "center",
        fontSize: "1.3rem",
        alignItems: "center",
        padding:"10px",
        borderRadius: "10px"
    }
    const join = (e) => {
        if(!username || !roomid){
            e.preventDefault();
        }
        else return null;
    }
    return (
        <div className="join">
            <div className="join-body">
                <div className="join-form">
                    <div className="join-heading">
                        <Avatar src="https://store.playstation.com/store/api/chihiro/00_09_000/container/IN/en/99/EP2402-CUSA05624_00-AV00000000000240/0/image?_version=00_09_000&platform=chihiro&bg_color=000000&opacity=100&w=720&h=720" sx={{ width: 120, height: 120 }}/>
                        <h1>Join server</h1>
                    </div>
                    <div className="join-form">
                        <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}></input>
                        <input type="text" placeholder="roomId" onChange={(e) => setRoomid(e.target.value)}></input>
                        <Link style={stl} to={`/chat?name=${username}&&room=${roomid}`} onClick={e=>{join(e);}}>Join</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Join
