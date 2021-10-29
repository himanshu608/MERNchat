// https://overreacted.io/
import './App.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
// import Join from './components/Join';
import queryString from 'query-string';
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { transports: ['websocket', 'polling', 'flashsocket'] })

function App({ location }) {
  const a = queryString.parse(location.search);
  
  return (
    <div className="App">
      <div className="appbody">
        <Sidebar name={a.name} />
        <Chat user={a.name} room={a.room} socket={socket} />
      </div>
    </div>
  );
}

export default App;
