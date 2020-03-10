import React from 'react';
import { BrowserRouter as Router, Route, } from 'react-router-dom';
import {Global} from './GlobalContext';

import './App.css';

import Join from './Join/Join'
import Chat from './Chat/Chat';

const App = () => (
    <Router className="app">
        <Global>
            <Route path="/" exact component={Join}/>
            <Route path="/chat" component={Chat}/>
        </Global>
    </Router>
)

export default App;