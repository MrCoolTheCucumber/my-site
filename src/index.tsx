import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/home';
import "./index.scss";

class App extends React.Component {
    render() {
        return (
            <div className="app-wrapper">
                <div style={{paddingLeft: '30px', paddingRight: '30px', height: '100%'}}>
                    <Home />
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
