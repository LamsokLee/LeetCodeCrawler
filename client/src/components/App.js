import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const NavigationBar = require('./NavigationBar').default;
const Log = require('./Log').default;
const Ranking = require('./Ranking').default;

class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <Route path ='/' component = {NavigationBar}/>
                    <Route exact path = '/' component = {Ranking}/>
                    <Route exact path = '/log' component = {Log}/>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;