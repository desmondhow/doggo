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

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            signedIn: false,
            redirectToReferrer: false
        };
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        request(
            routes.loginURL,
            JSON.stringify({
                'email': this.state.email,
                'password': this.state.password
            })
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.status === 200) {
                    sessionStorage.setItem("userId", res.message);
                    this.setState({ signedIn: true, redirectToReferrer: true });
                }
                else {
                    alert(res.message);
                }
            })
            .catch(err => {
                alert('There was an issue connecting to the server. Please try again.');
            })

    }
    render() {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="my-form">
                    <Form.Group>
                        <Form.Control id="email" type="email" placeholder="Email" className="form-input" onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control id="password" type="password" placeholder="Password" className="form-input" onChange={this.handleChange} />
                    </Form.Group>
                    <Button type="submit" className="form-btn form-control">Sign In</Button>
                </Form>
                <div>
                    <h4 className="fade-text">Don't have an account yet? <Link to={'/signup'}>Sign Up</Link></h4>
                </div>
            </div >
        )
    }
}

export default Login;