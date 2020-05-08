import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


class NavigationBar extends Component {
    render() {
        return (
            <Navbar bg="light">
                <Navbar.Brand as={Link} to="/">LeetCode Crawler</Navbar.Brand>
                <Nav.Link as={Link} to="/">Questions</Nav.Link>
                <Nav.Link as={Link} to="/user">Users</Nav.Link>
                <Navbar.Collapse className="justify-content-end">
                    <a class="github-button" href="https://github.com/LamsokLee/LeetCodeCrawler" data-icon="octicon-star" data-size="large" aria-label="Star ntkme/github-buttons on GitHub">Star</a>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;
