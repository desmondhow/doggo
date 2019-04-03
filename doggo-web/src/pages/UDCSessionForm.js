import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { windDirection } from '../assets/constants';

class UDCSessionForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: this.props.location.state.session
        }

        this.handleChange = this.handleChange.bind(this);
    }

    formatDropdown() {
        const options = [];
        for (let i = 100; i >= 0; i--) {
            options.push(
                <option key={i}>{i}</option>
            )
        }
        return options;
    }

    handleChange = event => {
        const id = event.nativeEvent.target.id;
        const value = event.nativeEvent.target.value;
        const sessionCopy = this.state.session;
        sessionCopy[id] = value;
        this.setState({session: sessionCopy})
        console.log(this.state.session)
    }

    render() {
        return (
            <Form>
                <Form.Group controlId="temperature">
                    <Form.Label>Temperature</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.session.temperature} onChange={this.handleChange}>
                        {this.formatDropdown()}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="humidity">
                    <Form.Label>Humidity</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.session.humidity} onChange={this.handleChange}>
                        {this.formatDropdown()}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="wind">
                    <Form.Label>Wind</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.session.wind} onChange={this.handleChange}>
                        {this.formatDropdown()}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="windDirection">
                    <Form.Label>Wind Direction</Form.Label>
                    <Form.Control as="select" defaultValue={this.state.session.windDirection} onChange={this.handleChange}>
                        {windDirection.map(dir => {
                            return <option key={dir}>{dir}</option>
                        })}
                    </Form.Control>
                </Form.Group>
            </Form>
        )
    }
}

export default UDCSessionForm;