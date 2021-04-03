import React from 'react';
import { Link } from 'react-router-dom';
import './header.scss';

export default class Home extends React.Component {
    render() {
        return (
            <div className="header">
                <span className="header__name">Ruben Ghatoaura</span>
                <Link to="/">Home</Link>
                <Link to="/blog">Blog</Link>
                <Link to='/project'>Projects</Link>
            </div>
        )
    }
}