import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import { getDogs, getSessionData } from '../assets/api/generalAPI';

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
                .then(data => {
                    Object.values(data).forEach(session => {
                        if (session.dogsTrained) {
                            Object.keys(session.dogsTrained).forEach(dogId => {
                                const dogs = this.state.dogs;
                                console.log(dogs.find(dogObj => dogObj._id === dogId + ""));
                            })
                        }
                    })

                    this.setState(prevState => ({
                        sessionData: {
                            ...prevState.sessionData,
                            [key]: data
                        }
                    }))
                    console.log(this.state);

                })
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
            this.state.dogs.forEach(dog => {
                const dogId = dog._id;
                const dogName = dog.name;

                if (!this.state.searchValue || dogName.toLowerCase().startsWith(this.state.searchValue)) {
                    dogRows.push(
                        <tr key={dogId}>
                            <td>{dogName}</td>
                            <td><Button className="form-btn" onClick={() => this.viewDogProfile(dogId, dogName)}>View Profile</Button></td>
                        </tr>
                    );
                }
            });
        }

        return (
            <div>
                {this._renderSearchBar()}
                <div className="my-table">
                    <Table>
                        <thead>
                            <tr>
                                <th colSpan="2" style={{ border: "none" }}>All Dogs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dogRows}
                        </tbody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default Home;