import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'

class Log extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: [],
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getLog(), 1000);
        
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getLog() {
        fetch('/api/v1/log')
        .then(response => response.json())
        .then(l => this.setState({ logs : l['file']}));
    }

    render() {
        return (
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Message</th>
                        <th>Level</th>
                        <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.logs.map(msg => (
                                <tr>
                                <td>{msg.message}</td>
                                <td>{msg.level}</td>
                                <td>{msg.timestamp}</td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default Log;