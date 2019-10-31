import React, { Component } from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { number } from 'prop-types';
import filterFactory from 'react-bootstrap-table2-filter';
import Container from 'react-bootstrap/Container';


class Log extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: [],
            columns: [{
                dataField: 'message',
                text: 'Message',
                type: number,
                headerStyle: () => {
                    return {
                        'width': '70%'
                    };
                }
            },{
                dataField: 'level',
                text: 'Level',
                type: number,
            },{
                dataField: 'timestamp',
                text: 'Time',
                type: number,
                sort: true
            }]
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
                <BootstrapTable
                    keyField='timestamp'
                    data={this.state.logs}
                    columns={this.state.columns}
                    bootstrap4='true'
                    filter={filterFactory()}
                    noDataIndication="No log"
                    hover
                    striped
                    condensed
                    bordered={false}   
                />
            </Container>
        );
    }
}

export default Log;