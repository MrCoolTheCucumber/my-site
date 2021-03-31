import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import Header from './header';
import Footer from './footer';
import Content from './content'

export default class Home extends React.Component {
    render() {
        return (
            <Router>
                <Header />
                <Content />
                <Footer />
            </Router>
        )
    }
}