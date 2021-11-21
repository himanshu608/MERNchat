import React, { useState, useContext } from 'react'
import { Avatar } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import './join.css';
import { ImpulseSpinner, CubeSpinner } from "react-spinners-kit";
import AuthContext from '../contexts/AuthContext'
import { auth } from '../Firebase'

function Join() {
    const { currentUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [roomid, setRoomid] = useState("");
    const history = useHistory();
    const stl = {
        color: "white",
        textDecoration: 'none',
        backgroundColor: "crimson",
        width: "100%",
        height: "50px",
        textAlign: "center",
        fontSize: "1.3rem",
        alignItems: "center",
        padding: "10px",
        borderRadius: "10px"
    }
    const join = (e) => {
        if (!username || !roomid) {
            e.preventDefault();
        }
        else {
            e.preventDefault();
            document.querySelector('.loading-div').classList.remove('hide');
            fetch('http://localhost:5000/roomidadd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: currentUser.email, username: username, rooms: roomid })
            })
                .then((res) => {
                    console.log(res);
                })
                .catch(err => {
                    console.error(err.message);
                })
            setTimeout(() => {
                history.push(`/chat?name=${username}&&room=${roomid}`);
            }, 2500)
        }
    }
    function logout() {
        auth.signOut().then(() => { console.log('logged out'); }).catch(err => { console.log(err); })
        console.log('logged out');
    }
    return (
        <>
            <div className="loading-div hide">
                <div className="load">
                    <CubeSpinner color={"red"} type={'bars'} size={60} />
                    <div style={{ marginTop: "50px", marginLeft: '10px' }}>
                        <ImpulseSpinner />
                    </div>
                </div>
            </div>
            <div className="join">
                <div className="join-body d-flex text-center">
                    <div className="join-form">
                        <div className="join-heading">
                            <Avatar src="https://store.playstation.com/store/api/chihiro/00_09_000/container/IN/en/99/EP2402-CUSA05624_00-AV00000000000240/0/image?_version=00_09_000&platform=chihiro&bg_color=000000&opacity=100&w=720&h=720" sx={{ width: 120, height: 120 }} />
                            <h1>Join server</h1>
                        </div>
                        <div className="join-form">
                            <input type="text" placeholder="username" onChange={(e) => setUsername(e.target.value)}></input>
                            <input type="text" placeholder="roomId" onChange={(e) => setRoomid(e.target.value)}></input>
                            <Link style={stl} to={`/chat?name=${username}&&room=${roomid}`} onClick={e => { join(e); }}>Join</Link>

                        </div>
                        <div>
                            <span>--- or ---</span>
                            <button className="btn btn-primary d-block text-medium" onClick={logout}>Logout</button>
                        </div>
                    </div>
                   
                </div>
            </div>
        </>
    )
}

export default Join
