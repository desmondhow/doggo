import React, { Component } from 'react';

class DogProfile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dogId: props.match.params.id
        }
    }
    render(){
        return (
            <div>Looking @ {this.state.dogId} Doggo</div>
        )
    }
}

export default DogProfile;