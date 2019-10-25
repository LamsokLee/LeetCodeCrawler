import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const NavigationBar = require('./NavigationBar').default;
const Log = require('./Log').default;

class App extends Component {
    render() {
        return (
            <div>
                <NavigationBar></NavigationBar>
                <BrowserRouter>
                    <Route exact path = '/log' component = {Log}/>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;