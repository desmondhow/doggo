import React, { Component } from 'react';
import { formatDate } from '../assets/helpers';

class GeneralInfo extends Component {
    constructor(props) {
        super(props)
        console.log(props)

    }

    render() {
        return (
            <div className="general-info">
                <div><span className="bold">Date:</span> {formatDate(this.state.session.createdAt)} </div>
                <div><span className="bold">Temperature:</span> {this.state.session.temperature}</div>
                <div><span className="bold">Humidity:</span> {this.state.session.humidity}</div>
                <div><span className="bold">Wind:</span> {this.state.session.wind}</div>
                <div><span className="bold">Wind Direction:</span> {this.state.session.windDirection}</div>
            </div>
        )
    }
}

export default GeneralInfo;