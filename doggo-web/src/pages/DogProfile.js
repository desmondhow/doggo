import React, { Component } from 'react';
import '../assets/stylesheets/Profile.css';
import paw from '../assets/images/paw_print.png';

class DogProfile extends Component {
    constructor(props) {
        super(props)
        // temporary state variables, potential characteristics to store in DB
        this.state = {
            dogId: props.location.state.dogId,
            dogName: props.location.state.dogName,
            age: 4,
            weight: "75lbs",
            rewardType: "tug"
        }

    }

    componentDidMount() {
        // get dog session info

    }
    render(){
        return (
            <div>
                <div className="dog-profile">
                    <div className="profile-photo">
                        <img src={paw}></img>
                    </div>
                    <div className="profile-info">
                        <div><span class="bold">Name:</span> {this.state.dogName} </div>
                        <div><span class="bold">Age:</span> {this.state.age}</div>
                        <div><span class="bold">Weight:</span> {this.state.weight}</div>
                        <div><span class="bold">Reward Type:</span> {this.state.rewardType}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DogProfile;