import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { number } from 'prop-types';
import { Container } from 'react-bootstrap';


const defaultSorted = [{
    dataField: 'question_id',
    order: 'asc'
}];

class ProblemLinkFormatter extends React.Component {
    render() {
        return (
            <a href={this.props.link}> {this.props.title} </a>
        );
    }
}


class Ranking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problemList: [],
            columns: [{
                dataField: 'question_id',
                text: 'UID',
                style: { width : '50%' },
                type: number,
                filter: textFilter(),
                hidden: true,
                sort: true
            }, {
                dataField: 'frontend_id',
                text: 'ID',
                type: number,
                filter: textFilter({
                    style: {  }
                }),
                sort: true
            }, {
                dataField: 'question__title',
                text: 'Name',
                sort: true,
                filter: textFilter({
                    placeholder: '',
                    style: { width : '100%' }
                }),
                headerStyle: (colum, colIndex) => {
                    return {
                        'width': '30%'
                    };
                },
                formatter: (cell, row, rowIndex) => {
                    var url = "https://leetcode.com/problems/" + row['question__title_slug'];
                    return (
                        <ProblemLinkFormatter link={url} title={cell}> cell </ProblemLinkFormatter>
                    )
                }
            }, {
                dataField: 'total_submitted',
                text: 'Submission',
                type: number,
                sort: true,
                classes: 'table-holder',
                style: {
                    'overflow-x':'auto'
                }
            }, {
                dataField: 'total_acs',
                text: 'Accept',
                type: number,
                sort: true
            }, {
                dataField: "acceptance_rate.$numberDecimal",
                text: 'Acceptance Rate (%)',
                type: number,
                sort: true,
                formatter: (cell, row) => {
                    if (cell) {
                        return (cell * 100).toFixed(2);
                    } else {
                        return "-"
                    }
                }
            }, {
                dataField: 'like_count',
                text: 'Liked',
                type: number,
                sort: true,
                formatter: (cell, row) => {
                    if (cell) {
                        return cell;
                    } else {
                        return "-";
                    }
                }
            }, {
                dataField: 'dislike_count',
                text: 'Disliked',
                type: number,
                sort: true,
                formatter: (cell, row) => {
                    if (cell) {
                        return cell;
                    } else {
                        return "-";
                    }
                }
            }, {
                dataField: "like_rate.$numberDecimal",
                text: 'Like Rate (%)',
                type: number,
                sort: true,
                formatter: (cell, row) => {
                    if (cell) {
                        return (cell * 100).toFixed(2);
                    } else {
                        return "-"
                    }
                }
            }]
        };

        this.getAllProblems();
    }

    async getAllProblems() {
        fetch('/api/v1/ranking')
            .then(response => response.json())
            .then(l => this.setState({ problemList: l }));
    }

    render() {
        return (
            <Container>
                <BootstrapTable 
                    keyField='question_id'
                    data={this.state.problemList}
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

export default Ranking;
