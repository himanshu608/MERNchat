import React, { useContext } from 'react'
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import queryString from 'query-string';
import './mainChat.css'
import AuthContext from './contexts/AuthContext'
import {Redirect} from 'react-router-dom'
function MainChat({ location }) {

    const a = queryString.parse(location.search); //getting query data from url
    const { currentUser } = useContext(AuthContext);  //get info about current logged in user




    function scrll() { //function to scroll chat component to right in mobile screens for proper chat component view
        document.querySelector('.App').scrollBy({
            top: 0,
            left: 620,
            behavior: 'smooth'
        });
    }

    
    return (
        <>
            {currentUser ? //if current user is logged in then show chat oherwise send to login page
                <div className="App">
                    <div className="appbody">
                        <Sidebar name={a.name} room={a.room} scroll={scrll} />
                        <Chat user={a.name} room={a.room} />
                    </div>
                </div>
                : <Redirect to="/" />
            }
        </>
    );
}

export default MainChat
