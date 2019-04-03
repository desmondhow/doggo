import React, { Component } from 'react';
import routes from '../assets/api/Api';
import { request } from '../assets/helpers';
import '../assets/stylesheets/Form.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
    Link,
    Redirect
} from 'react-router-dom';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            passwordConf: "",
            signedIn: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        request(
            routes.registerURL,
            JSON.stringify({
                'email': this.state.email,
                'password': this.state.password,
                'password_conf': this.state.password_conf,
            })
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 200) {
                    sessionStorage.setItem("userId", res.message);
                    this.setState({signedIn: true})
                }
                else {
                    alert(res.message);
                }
            })
            .catch(err => alert('There was an issue connecting to the server. Please try again.'))
    };

    render() {
        if (this.state.signedIn) {
            return <Redirect to={"/"} />
        }
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="my-form">
                    <Form.Group>
                        <Form.Control id="email" type="email" placeholder="Email" className="form-input" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control id="passowrd" type="password" placeholder="Password" className="form-input" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control id="passwordConf" type="password" placeholder="Confirm Password" className="form-input" />
                    </Form.Group>
                    <Button type="submit" className="form-btn form-control">Sign Up</Button>
                </Form>
                <div>
                    <h4 className="fade-text">Already have an account? <Link to={'/login'}>Log In</Link></h4>
                </div>
            </div >
        )
    }
}

export default Signup;