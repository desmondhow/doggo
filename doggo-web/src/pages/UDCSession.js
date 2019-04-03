import React, { Component } from 'react';
import '../assets/stylesheets/Profile.css';

class UDCSession extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: this.props.location.state.session
        }
        console.log(this.state)
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default UDCSession;