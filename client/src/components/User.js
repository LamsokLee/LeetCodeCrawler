import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { number } from 'prop-types';
import { Container } from 'react-bootstrap';


const defaultSorted = [{
    dataField: 'contest_ranking',
    order: 'asc'
}];


class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userList: [],
            columns: [{
                dataField: 'user_id',
                text: 'ID',
                filter: textFilter(),
                sort: true
            }, {
                dataField: 'real_name',
                text: 'Name',
                sort: true,
                filter: textFilter()
            }, {
                dataField: 'contest_finished',
                text: 'Contest Finished',
                type: number,
                sort: true,
                classes: 'table-holder',
                style: {
                    'overflow-x':'auto'
                }
            }, {
                dataField: 'contest_ranking',
                text: 'Ranking',
                type: number,
                sort: true
            }, {
                dataField: 'progress_accepted',
                text: 'Accepted',
                sort: true
            }, {
                dataField: 'progress_solved',
                text: 'Solved',
                sort: true
            }, {
                dataField: 'progress_submitted',
                text: 'Submitted',
                sort: true
            }, {
                dataField: 'location',
                text: 'Location',
                filter: textFilter(),
                sort: true
            }, {
                dataField: 'school',
                text: 'School',
                filter: textFilter(),
                sort: true
            }]
        };

        this.getAllUsers();
    }

    async getAllUsers() {
        fetch('/api/v1/user')
            .then(response => response.json())
            .then(l => this.setState({ userList: l }));
    }

    render() {
        return (
            <Container>
                <BootstrapTable 
                    keyField='question_id'
                    data={this.state.userList}
                    columns={this.state.columns}
                    bootstrap4='true'
                    pagination={paginationFactory({ paginationSize: 5, sizePerPage: 50, showTotal: true })}
                    filter={filterFactory()}
                    defaultSorted={defaultSorted}
                    noDataIndication="No questions"
                    hover
                    striped
                    condensed
                    bordered={false}
                />
            </Container>
        )
    }
}

export default User;
