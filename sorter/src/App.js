import React, { Component } from 'react';
import { Grid, Row, Col, Navbar, Jumbotron, Button, ButtonGroup, Label, Panel } from 'react-bootstrap';

// import logo from './logo.svg';
import './App.css';

const TYPE_INTEGER = 'integer';
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';

const SORT_DATA_NOT_READY = 'sort_ready';
const SORT_READY = 'sort_ready';
const SORT_STARTED = 'sort_started';
const SORT_COMPLETED = 'sort_completed';
// const SORT_PROCESSING = 'sort_processing';


function makePostRequest(type, data_array) {
    return fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type,
            data_array,
        })
    })

}
class ArrayInputControl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '["100", "90", "10", "5", "20", "1", "3", "4", "2", "6", "7", "9", "8", "Z", "a", "b"]'
            // value: '[100, 90, 10, 5, 20, 1, 3, 4, 2, 6, 7, 9, 8]'
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        try {
            let arrayString = this.state.value;
            let parsedData = JSON.parse(arrayString);
            if (Array.isArray(parsedData)) {
                this.props.consumeArray(parsedData)
            }
        } catch (e) {
            this.props.consumeArray([])
            // skip
        }
    }

    componentDidMount() {
        this.handleChange({
            target:{
                value:this.state.value
            }
        });
    }
    render() {
        return (
                <Label htmlFor="inputArray">
                    Array to Sort:
                    <textarea className="form-control"
                              rows="20"
                              id="inputArray"
                              value={this.state.value}
                              onChange={this.handleChange} />
                </Label>
        );
    }
}
function ArrayView (props) {
    return (
        <ul>
            {props.data.map((item, index) => <li key={index}>{JSON.stringify(item)}</li>)}
        </ul>
    );
}
class AppView extends Component {

    render () {
        let {type, selectType, sorted, unsorted,
            sortAction, sortDataStatus, consumeArray} = this.props;
        return (
            <div>
                <Navbar inverse fixedTop>
                    <Grid>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="/">Sorter App</a>
                            </Navbar.Brand>
                            <Navbar.Toggle/>
                        </Navbar.Header>
                    </Grid>
                </Navbar>
                <Jumbotron>
                    <Grid>
                        <Row>
                            <Col xs={6}>
                                <ButtonGroup>
                                    <Button
                                        bsStyle={type === TYPE_INTEGER ? "primary" : "info"}
                                        bsSize="large"
                                        onClick={() => selectType(TYPE_INTEGER)}>
                                        Integer
                                    </Button>
                                    <Button
                                        bsStyle={type === TYPE_STRING ? "primary" : "info"}
                                        bsSize="large"
                                        onClick={() => selectType(TYPE_STRING)}>
                                        String
                                    </Button>
                                    <Button
                                        bsStyle={type === TYPE_OBJECT ? "primary" : "info"}
                                        bsSize="large"
                                        onClick={() => selectType(TYPE_OBJECT)}>
                                        Object
                                    </Button>
                                </ButtonGroup>


                            </Col>
                            <Col xs={6}>
                                <ButtonGroup className="pull-right">
                                    <Button
                                        bsStyle="success"
                                        bsSize="large"
                                        onClick={sortAction}>
                                        Sort Array
                                    </Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                        <Row className="body">
                            <Col xs={4} className="full-height">
                                <Panel>
                                    <Panel.Heading>
                                        Raw Data
                                    </Panel.Heading>
                                    <Panel.Body>
                                        <ArrayInputControl
                                            consumeArray={consumeArray}
                                        />
                                    </Panel.Body>
                                </Panel>

                            </Col>
                            <Col xs={4} className="full-height">
                                <Panel>
                                    <Panel.Heading>
                                        Unsorted Array
                                    </Panel.Heading>
                                    <Panel.Body>
                                        <ArrayView data={unsorted}/>
                                    </Panel.Body>
                                </Panel>
                            </Col>
                            <Col xs={4} className="full-height">
                                <Panel>
                                    <Panel.Heading>
                                        Sorted Array
                                    </Panel.Heading>
                                    <Panel.Body>                                                            <ArrayView data={sorted}/>
                                    </Panel.Body>
                                </Panel>

                            </Col>
                        </Row>
                    </Grid>
                </Jumbotron>
            </div>
        );
    }
}

function getCompatorFunction(type) {
    if (type === TYPE_INTEGER) {
        return comparatorInteger;
    } else if (type === TYPE_STRING) {
        return comparatorString;
    } else if (type === TYPE_OBJECT) {
        return comparatorObject;
    }

}
function comparatorInteger(a, b) {
    if (a === b) {
        return 0
    } else if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
}
function comparatorString(a, b) {
    if (a === b) {
        return 0
    } else if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
}
function comparatorObject(a, b) {
    if (a === b) {
        return 0
    } else if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
}


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: TYPE_INTEGER,
            unsorted: [],
            sorted: [],
            sortDataStatus: SORT_DATA_NOT_READY,
            comparatorFn: comparatorInteger,
        };

        // this.handleChange = this.handleChange.bind(this);
        this.selectType = this.selectType.bind(this);
        this.consumeArray = this.consumeArray.bind(this);
        this.sortAction = this.sortAction.bind(this);
    }

    selectType (type) {
        this.setState({type});
    }

    consumeArray (data) {
        this.setState({
            unsorted: data,
            sortDataStatus: SORT_READY,
        });
    }

    sortAction () {

        if (this.state.type === TYPE_INTEGER) {
            this.setState(
                {
                    sorted: [...this.state.unsorted].sort(getCompatorFunction(this.state.type))
                }
            );

        } else {
            makePostRequest(this.state.type, this.state.unsorted).then(
                (response) => {
                    console.log("(response) => { response === ", response);
                    let responseJson = response.json();
                    console.log("let responseJson = response.json(); responseJson  === ", responseJson);
                    responseJson.then(sorted => this.setState({sorted}));
                }
            );
        }
    }

    render () {
        return (
            <AppView
                type={this.state.type}
                sortDataStatus={this.state.sortDataStatus}
                selectType={this.selectType}
                consumeArray={this.consumeArray}
                sortAction={this.sortAction}
                sorted={this.state.sorted}
                unsorted={this.state.unsorted}
            />
        );
    }

}

export default App;
