import React from 'react';
import ReactDOM from 'react-dom';
import _App from './components/app';
import "./index.scss";

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
