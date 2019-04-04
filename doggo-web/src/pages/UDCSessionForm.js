import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import '../assets/stylesheets/Form.css';

import { windDirection } from '../assets/constants';
import { udcPerformance } from '../assets/constants';

class UDCSessionForm extends Component {
    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            session: this.props.location.state.session,
            dogData: this.props.location.state.dogData,
            dogName: this.props.location.state.dogName
        }
        this.handleChange = this.handleChange.bind(this);
    }

    formatRangeDropdown(num, constant, label, order) {
        const options = [];
        if (order < 0) {
            // desc
            for (let i = num; i >= 0; i--) {
                options.push(
                    <option key={i}>{i}</option>
                )
            }
        } else {
            // asc
            for (let i = 0; i <= num; i++) {
                options.push(
                    <option key={i}>{i}</option>
                )
            }
        }
        return (
            <Form.Group controlId={constant} onChange={this.handleChange}>
                <Form.Label>{label}</Form.Label>
                <Form.Control as="select">
                    {options}
                </Form.Control>
            </Form.Group>
        )
    }

    formatDropdown(fieldArr, constant, label) {
        return (
            <Form.Group controlId={constant} onChange={this.handleChange}>
                <Form.Label>{label}</Form.Label>
                <Form.Control as="select">
                    {fieldArr.map(field => {
                        return (
                            <option>{field}</option>
                        )
                    })}
                </Form.Control>
            </Form.Group>
        )
    }

    formatCheckboxes(fieldArr, constant, label) {
        return (
            <Form.Group controlId={constant} onChange={this.handleChange}>
                <Form.Label>{label}</Form.Label>
                <div className="scroll-box">
                    {fieldArr.map(field => {
                        return (
                            <Form.Check
                                type="checkbox"
                                id={field.value}
                                label={field.label}
                                value={field.label}
                            />
                        )
                    })}
                </div>
            </Form.Group>
        )
    }

    // buttonGroupChange(event, constant) {
    //     console.log(event.target.id)
    //     console.log(constant)

    // }

    // formatButtonGroup(fieldArr, constant) {
    //     return (
    //         <ButtonGroup vertical onClick={(event) => this.buttonGroupChange(event, constant)}>
    //             {fieldArr.map(field => {
    //                 return (
    //                     <Button key={field} id={field} className="checkboxButton">{field}</Button>
    //                 )
    //             })}
    //         </ButtonGroup>
    //     )
    // }

    handleChange = event => {
        const id = event.nativeEvent.target.id;
        const value = event.nativeEvent.target.value;
        console.log(id, value)
        // const sessionCopy = this.state.session;
        // sessionCopy[id] = value;
        // this.setState({ session: sessionCopy })
        // console.log(this.state.session)
    }

    renderEditForm() {
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

    render() {
        return (
            <div>
                <thead>
                    <tr>
                        <th>Performance</th>
                    </tr>
                </thead>
                {this.formatDropdown(udcPerformance.HandlerRadius, "radiusAlert", "Alert")}
                {this.formatDropdown(udcPerformance.HandlerRadius, "radiusReward", "Reward")}
                {this.formatDropdown(udcPerformance.HandlerRadius, "radiusSearch", "Search")}
                {this.formatDropdown(["Handler", "Trainer"], "rewarder", "Rewarder")}
                {this.formatRangeDropdown(40, "barks", "Barks", 1)}
                {this.formatCheckboxes(udcPerformance.Fields, "failCodes", "Select all that apply:")}
                {this.formatCheckboxes(udcPerformance.FailCodes, "failCodes", "Failure Codes")}
                {this.formatCheckboxes(udcPerformance.Distractions, "distractions", "Distractions")}
            </div>
        )
    }
}

export default UDCSessionForm;