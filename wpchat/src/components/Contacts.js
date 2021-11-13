import { Avatar, IconButton } from '@mui/material'
import React from 'react'
import './contact.css';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Link } from 'react-router-dom';
function Contacts({name,room,src}) {
    return (
        <div className="contacts d-grid">
            <div className="contact row">
                <div className="contact-left col-10">
                    <Avatar src={src} />
                    <div className="contact-info">
                        <h2>{room}</h2>
                        <p>last messages</p>
                    </div>
                </div>
                <div className="arrow-div col-2">
                <Link to={`/chat?name=${name}&&room=${room}`} ><IconButton  sx={{color:"white"}}>
                <DoubleArrowIcon />
                </IconButton></Link>
                </div>
            </div>
        </div>
    )
}

export default Contacts
