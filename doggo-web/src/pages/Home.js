import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import { getDogs, getDogSessions, getSessionData } from '../assets/api/generalAPI';
import {
    Redirect
} from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            dogs: null,
            sessionData: {
                "UDC": null,
                "LHS": null,
                "OBD": null
            }
        };
    }

    componentDidMount() {
        // get all dogs
        getDogs()
            .then(dogs => this.setState({ dogs: dogs }))

        // get all sessions, to be passed later for DogProfile or other screens
        Object.keys(this.state.sessionData).forEach(key => {
            getSessionData(key)
            .then(data => this.setState(prevState => ({ 
                sessionData: {
                    ...prevState.sessionData,
                    [key]: data 
                }
            })))
        }) 
    }

    viewDogProfile = (dogId, dogName) => {
        // API call
        this.props.history.push({ pathname: "/dogProfile", state: { dogId: dogId, dogName: dogName, sessionData: this.state.sessionData } })
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value.toLowerCase()
        });
    }


    _renderSearchBar = () => (
        <InputGroup className="mb-3">
            <FormControl
                placeholder="Enter K9 Name..."
                aria-label="Enter K9 Name..."
                aria-describedby="basic-addon2"
                id="searchValue" onChange={this.handleChange}
            />
        </InputGroup>
    );

    render() {
        let dogRows = [];
        if (this.state.dogs) {
            this.state.dogs.map((dog, i) => {
                const dogId = dog._id;
                const dogName = dog.name;

                if (
                    !this.state.searchValue ||
                    dogName.toLowerCase().startsWith(this.state.searchValue)
                ) {
                    dogRows.push(
                        <tr key={dogId}>
                            <td>{dogName}</td>
                            <td><Button onClick={(event) => this.viewDogProfile(dogId, dogName)}>View Profile</Button></td>
                        </tr>
                    );
                }
            });
        }

        return (
            <div>
                {this._renderSearchBar()}
                <Table>
                    <thead>
                        <tr>
                            <th colSpan="2">All Dogs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dogRows}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default Home;