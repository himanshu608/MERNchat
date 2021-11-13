import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Join from './components/Join';
// window.ethereum.autoRefreshOnNetworkChange = false;

ReactDOM.render(
 
  <Router>
    <Switch>
      <Route exact path="/" component={Join} />
      <Route exact path="/chat" component={App} />
    </Switch>
  </Router>
  ,
  document.getElementById('root')
);

