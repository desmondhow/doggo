import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { isSignedIn } from '../assets/helpers';
import { Redirect } from 'react-router-dom';

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: isSignedIn()
        }
    }

    logoutUser = () => {
        sessionStorage.removeItem("userId");
        this.setState({signedIn: false})
    }

    render() {
        console.log("inside render")
        if (this.state.signedIn) {
            return <Button onClick={this.logoutUser}>Logout</Button>
        }
        return <Redirect to={"/"} />
    }
}