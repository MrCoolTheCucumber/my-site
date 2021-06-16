import React from 'react';
import { Link } from 'react-router-dom';
import './nav.scss';

export default class Nav extends React.Component {
    render() {
        return(
            <div className="nav">
                <Link to="/">Home</Link>
                <Link to="/blog">Blog</Link>
                <Link to='/project'>Projects</Link>
                <a href='https://github.com/RubenG123'>GitHub</a>
            </div>
        );
    }
}