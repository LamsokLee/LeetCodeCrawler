import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

class Footer extends Component {
    render() {
        return (
            <div class="container text-center">
                <p class="text-muted">Powered By:
                    <a href="https://github.com/LamsokLee/LeetCodeCrawler"> https://github.com/LamsokLee/LeetCodeCrawler</a>
                </p>
                <p>
                    <Link to="/log">Update Log</Link>
                </p>
            </div>
        );
    }
}

export default Footer;
