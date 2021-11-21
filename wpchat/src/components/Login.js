import React, { useState, useEffect ,useContext} from 'react';
import './login.css';
import { SocialIcon } from 'react-social-icons';
import { IconButton } from '@mui/material';
import {GoogleAuthProvider,GithubAuthProvider  } from 'firebase/auth'
// import { auth } from '../Firebase'
import {gAuth} from '../Firebase'
import AuthContext from '../contexts/AuthContext'
import {useHistory} from 'react-router-dom'


function Login() {
    const {currentUser} = useContext(AuthContext);
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [user, setUser] = useState({});
    // const [error, setError] = useState();
    const history = useHistory()

    //function to toggle between login and signup 
    // function toggle() {
    //     document.querySelector('.login-div').classList.toggle('order-2');
    //     document.querySelector('.signup-div').classList.toggle('order-1');
    //     // setEmail('');
    //     // setPassword('');
    //     // setError('')
    // }

    //if user is already logged in then go to chat page directly
    useEffect(() => {
        console.log(currentUser)
        if(currentUser) {
            fetch(`http://localhost:5000/isUserPresent/${currentUser.email}`)
            .then((response) => {return response.text()})
            .then(res=>{
                res = JSON.parse(res)
                console.log(res)
                if(res.length === 0 || res[0].rooms.length=== 0) history.push('/join')
                else history.push(`/chat?name=${res[0].username}&&room=${res[0].rooms[0]}`)
            })
            .catch(err => {console.log(err); })
        }
    },[currentUser])
   

    //function for automatic gmail login using google authentication
    function gmailLogin(){
        const gmailprovider = new GoogleAuthProvider();
        gAuth(gmailprovider);
    }
    function gitLogin(){
        const gitprovider = new GithubAuthProvider();
        gAuth(gitprovider);
    }
    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-4 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className=" bg-dark text-white d-flex flex-row justify-start flex  overflow-hidden " style={{ borderRadius: '1rem' }}>
                            <div className="login-div p-5 pb-4  d-flex flex-column text-center">
                                <h1 className="fs-1 mb-2">MERNChat</h1>
                                <div className=" mt-4 mb-4 pb-1 d-flex flex-row align-items-center justify-content-around">
                                    <IconButton onClick={gmailLogin}>
                                        <SocialIcon network={'google'} fgColor={'white'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                    <IconButton onClick={gitLogin} >
                                        <SocialIcon network={'github'} bgColor={'white'} fgColor={'black'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                    <IconButton >
                                        <SocialIcon network={'facebook'} fgColor={'white'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                </div>
                                {/* <span className="mb-3">-- Or --</span> */}
                                {/* <form>
                                    <div className=" mt-md-4 pb-1">
                                        <div className="form-outline form-white mb-4 text-start">
                                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="form-control form-control-lg" />
                                        </div>

                                        <div className="form-outline form-white mb-4 text-start">
                                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="form-control form-control-lg" />
                                        </div>

                                        <p className="small mb-2 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                        <button className="btn btn-outline-light btn-lg px-5 mt-3" type="submit" >Login</button>
                                    </div>
                                </form> */}

                                {/* <div>
                                    <p className="mb-0 mt-4">Don't have an account? <span className="text-white-50 fw-bold " style={{ cursor: 'pointer' }} onClick={toggle}>Sign Up</span></p>
                                </div> */}

                            </div>



                            {/* <div className="signup-div p-5 d-flex flex-column text-center">
                                <h1 className="fs-1 mb-2">MERNChat</h1>
                                <h2>{user?.email}</h2>
                                <h2>{error}</h2>
                                <div className=" mt-4 mb-4 pb-1 d-flex flex-row align-items-center justify-content-around">
                                    <IconButton >
                                        <SocialIcon network={'google'} fgColor={'white'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                    <IconButton >
                                        <SocialIcon network={'github'} bgColor={'white'} fgColor={'black'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                    <IconButton >
                                        <SocialIcon network={'twitter'} fgColor={'white'} style={{ height: 45, width: 45 }} />
                                    </IconButton>
                                </div>
                                <span className="mb-3">-- Or --</span>
                                <div className=" mt-md-4 pb-1">
                                    <div className="form-outline form-white mb-4 text-start">
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="form-control form-control-lg" />
                                    </div>

                                    <div className="form-outline form-white mb-4 text-start">
                                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="form-control form-control-lg" />
                                    </div>

                                    <p className="small mb-2 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                                    <button className="btn btn-outline-light btn-lg px-5 mt-3" type="submit" >Sign Up</button>

                                </div>

                                <div>
                                    <p className="mb-0 mt-4">Already have an account? <span className="text-white-50 fw-bold" style={{ cursor: 'pointer' }} onClick={toggle}>Login</span></p>
                                </div>

                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login
