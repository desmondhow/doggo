import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
export function formatRangeDropdown(num, constant, label, order) {
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

export function formatDropdown(fieldArr, constant, label) {
    return (
        <Form.Group controlId={constant} onChange={this.handleChange}>
            {/* <Form.Label>{label}</Form.Label> */}
            <Form.Control as="select" defaultValue={performance.radiusAlert}> 
                {fieldArr.map(field => {
                    return (
                        <option>{field}</option>
                    )
                })}
            </Form.Control>
        </Form.Group>
    )
}

export function formatCheckboxes(fieldArr, constant, label) {
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