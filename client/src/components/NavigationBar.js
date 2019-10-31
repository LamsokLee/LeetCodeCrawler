import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


class NavigationBar extends Component {
    render() {
        return (
            <Navbar bg="light" expand="lg">
            <Navbar.Brand as={Link} to ="/">LeetCode Crawler</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Navbar>
        );
    }
}

export default NavigationBar;
