import React from 'react';
import ReactDOM from 'react-dom';
import _App from './components/app';
import Home from './components/home/home';
import "./index.scss";

import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom'

class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>

                    <Route>
                    <div className="app-wrapper">
                        <div className="app-wrapper__grid">
                            <_App />
                        </div>
                    </div>
                    </Route>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
