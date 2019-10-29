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
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to ="/log">Log</Nav.Link>
                    <Nav.Link as={Link} to ="/ranking">Ranking</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;
