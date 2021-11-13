// https://overreacted.io/
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
// import Join from './components/Join';
import queryString from 'query-string';



function App({ location }) {
  const a = queryString.parse(location.search);
  
  return (
    <div className="App">
      <div className="appbody">
        <Sidebar name={a.name} room={a.room} />
        <Chat user={a.name} room={a.room} />
      </div>
    </div>
  );
}

export default App;
