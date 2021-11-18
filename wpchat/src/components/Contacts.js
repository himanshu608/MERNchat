import { Avatar, IconButton } from '@mui/material'
import React, { useState, useEffect , memo } from 'react'
import './contact.css';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Link } from 'react-router-dom';
const Contacts =  memo(({ name, room ,scroll}) =>{
    const [src, setGrpSrc] = useState();
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

        }).catch(err => { console.log(err); });

    }, [room])

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
                    <Link to={`/chat?name=${name}&&room=${room}`} onClick={scroll}><IconButton sx={{ color: "white" }}>
                        <DoubleArrowIcon />
                    </IconButton></Link>
                </div>
            </div>
        </div>
    )
})

export default Contacts 
