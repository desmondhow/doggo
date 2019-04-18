import React, { Component } from 'react';
import '../assets/stylesheets/Sessions.css'; 
import { formatDate } from '../assets/helpers';

class GeneralInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: this.props.session
        }

    }

    render() {
        return (
            <div className="info-list">
                {/* <h3>General Info</h3> */}
                <div style={{flexGrow: "1"}}><span className="bold">Date:</span> {formatDate(this.state.session.createdAt)} </div>
                <div style={{flexGrow: "1"}}><span className="bold">Temperature:</span> {this.state.session.temperature}</div>
                <div style={{flexGrow: "1"}}><span className="bold">Humidity:</span> {this.state.session.humidity}</div>
                <div style={{flexGrow: "1"}}><span className="bold">Wind:</span> {this.state.session.wind}</div>
                <div style={{flexGrow: "1"}}><span className="bold">Wind Direction:</span> {this.state.session.windDirection}</div>
            </div>
        )
    }
}

export default GeneralInfo;