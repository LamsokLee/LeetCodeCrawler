import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';

import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'
import { Link } from 'react-router-dom';


class Ranking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problemList: [],
            columns : [{
                dataField : 'question_id',
                text : 'Question ID'
            }, {
                dataField : 'question__title',
                text : 'Question Name'
            }, {
                dataField : 'total_submitted',
                text : 'Submission'
            }, {
                dataField : 'total_acs',
                text : 'Accept'
            }, {
                dataField : 'acceptance_rate',
                text : 'Acceptance Rate'
            }, {
                dataField : 'like_count',
                text : 'Liked'
            }, {
                dataField : 'dislike_count',
                text : 'Disliked'
            }, {
                dataField : 'like_rate',
                text : 'Like Rate'
            }]           
        };

        this.getAllProblems();
    }

    async getAllProblems() {
        fetch('/api/v1/ranking')
        .then(response => response.json())
        .then(l => this.setState({ problemList : l}));
    }

    // render() {
    //     return (
    //         <BootstrapTable keyField = 'question_id' data = {this.state.problemList} columns = {this.state.columns}/>
    //     )
    // }
    render() {
        return (
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Question ID</th>
                        <th>Question Name</th>
                        <th>Submission</th>
                        <th>Accept</th>
                        <th>Acceptance Rate</th>
                        <th>Liked</th>
                        <th>Disliked</th>
                        <th>Liked Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.problemList.map(q => (
                                <tr>
                                <td>{q.question_id}</td>
                                <td>{q.question__title}</td>
                                <td>{q.total_submitted}</td>
                                <td>{q.total_acs}</td>
                                <td>{q.acceptance_rate == null ? 0 : q.acceptance_rate['$numberDecimal']}</td>
                                <td>{q.like_count}</td>
                                <td>{q.dislike_count}</td>
                                <td>{q.like_rate == null ? 0 : q.like_rate['$numberDecimal']}</td>
                                </tr>
                            ))
                        }
                        
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default Ranking;