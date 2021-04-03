import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './header';
import Footer from './footer';
import Content from './content'

export default class Home extends React.Component {
    render() {
        return (
            <Router>
                <Route exact path='/'>
                    <Content />
                </Route>

                <Route path='/(.+)'>
                    <Header />
                    <Content />
                    <Footer />
                </Route>
            </Router>
        )
    }
}