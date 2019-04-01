import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';

// import { request } from '../assets/helpers';
// import routes from '../assets/api/Api';
import { getUDC } from '../assets/api/udcAPI';
import { getDogs } from '../assets/api/generalAPI';
import {
    Redirect
} from 'react-router-dom';
import { isSignedIn } from '../assets/helpers';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: isSignedIn(),
            searchValue: "",
            dogs: null
        };
    }

    componentDidMount() {
        getDogs()
            .then(dogs => this.setState({ dogs: dogs }))

    }

    viewDogProfile = dogId => {
        // API call
        this.props.history.push("/dog/"+dogId)
        // return <Redirect to={"/dog?id={dogId}"} />
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
        if (!this.state.signedIn) {
            return <Redirect to={"/login"} />
        }
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
                            <td><Button onClick={(event)=>this.viewDogProfile(dogId)}>View Profile</Button></td>
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