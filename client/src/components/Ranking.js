import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, numberFilter, Comparator } from 'react-bootstrap-table2-filter';
import { number } from 'prop-types';
import Container from 'react-bootstrap/Container';


const defaultSorted = [{
    dataField: 'question_id', 
    order: 'asc'
}];

class ProblemLinkFormatter extends React.Component {
    render() {
        return (
        <a href = {this.props.link}> {this.props.title} </a>
        );
    }
}

var rateFilter = numberFilter({
    options: [0.3, 0.5, 0.8],
    comparators: [Comparator.GT, Comparator.LT],
    withoutEmptyComparatorOption: true,
    style: { display: 'inline-grid' },
    comparatorClassName: 'custom-comparator-class',
    numberClassName: 'custom-number-class'
});

class Ranking extends Component {
    constructor(props) {
        super(props);

        this.state = {
            problemList: [],
            columns : [{
                dataField : 'question_id',
                text : 'Question ID',
                type : number,
                filter: textFilter(),
                sort: true
            }, {
                dataField : 'question__title',
                text : 'Question Name',
                filter : textFilter(),
                formatter : (cell, row, rowIndex) => {
                    var url = "https://leetcode.com/problems/" + row['question__title_slug'];
                    return (
                        <ProblemLinkFormatter link = {url} title = {cell}> cell </ProblemLinkFormatter>
                    )
                }
            }, {
                dataField : 'total_submitted',
                text : 'Submission',
                type : number,
                sort: true
            }, {
                dataField : 'total_acs',
                text : 'Accept',
                type : number,
                sort: true
            }, {
                dataField : "acceptance_rate.$numberDecimal",
                text : 'Acceptance Rate (%)',
                type : number,
                sort: true,
                formatter : (cell, row) => {
                    return (cell * 100).toFixed(2);
                }
            }, {
                dataField : 'like_count',
                text : 'Liked',
                type : number,
                sort: true
            }, {
                dataField : 'dislike_count',
                text : 'Disliked',
                type : number,
                sort: true
            }, {
                dataField : "like_rate.$numberDecimal",
                text : 'Like Rate (%)',
                type : number,
                sort: true,
                formatter : (cell, row) => {
                    return (cell * 100).toFixed(2);
                }
            }]           
        };

        this.getAllProblems();
    }

    async getAllProblems() {
        fetch('/api/v1/ranking')
        .then(response => response.json())
        .then(l => this.setState({ problemList : l}));
    }

    render() {
        return (
            <Container>
                <BootstrapTable 
                    bootstrap4 = 'true' 
                    keyField = 'question_id'
                    data = {this.state.problemList}
                    columns = {this.state.columns}
                    pagination = { paginationFactory() }
                    filter = { filterFactory() }
                    defaultSorted = { defaultSorted }
                    hover
                />
            </Container>
        )
    }
}

export default Ranking;
