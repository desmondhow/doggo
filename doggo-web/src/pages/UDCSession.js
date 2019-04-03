import React, { Component } from 'react';
import GeneralInfo from '../components/GeneralInfo';

class UDCSession extends Component {
    constructor(props) {
        super(props)
        this.state = {
            session: this.props.location.state.session
        }
    }

    renderGeneral(session) {
        
    }

    render() {
        return (
            <div>
                <GeneralInfo session={this.state.sessions}/>
            </div>
        )
    }
}

export default UDCSession;