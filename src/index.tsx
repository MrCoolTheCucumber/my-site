import React from 'react';
import ReactDOM from 'react-dom';
import _App from './components/app';
import "./index.scss";

// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

class App extends React.Component {
    render() {
        return (
            <div className="app-wrapper">
                <div className="app-wrapper__flex">
                    <_App />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
