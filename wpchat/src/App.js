// https://overreacted.io/
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import {auth} from './Firebase'
import {onAuthStateChanged} from 'firebase/auth'
import MainChat from './MainChat';
import Login from './components/Login';
import {useEffect,useState} from 'react'
import AuthContext from './contexts/AuthContext'
import Join from './components/Join'
function App() {
  const [currentUser,setCurrentUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(auth,(res)=>{ //change current user state every time there is a change in auth state
            setCurrentUser(res);
        })
    },[])


  return (
    <AuthContext.Provider value={{currentUser:currentUser}}>
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route  path="/chat" component={MainChat} />
        {currentUser?<Route exact path='/join' component={Join} />:<Redirect to='/' />}
      </Switch>
    </Router>
    </AuthContext.Provider>

  );
}

export default App;
