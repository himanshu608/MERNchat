import { Avatar } from '@mui/material'
import React from 'react'
import './contact.css';
function Contacts({room}) {
    return (
        <div className="contacts">
            <div className="contact">
                <Avatar />
                <div className="contact-info">
                    <h2>{room}</h2>
                    <p>last messages</p>
                </div>
            </div>
        </div>
    )
}

export default Contacts
