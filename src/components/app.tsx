import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from './header';
import Nav from './nav';
import Footer from './footer';
import Content from './content'

export default class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Route exact path='/'>
                    <Content />
                </Route>

                <Route path='/(.+)'>
                    <Header />
                    <Nav />
                    <Content />
                    <Footer />
                </Route>
            </React.Fragment>
        )
    }
}