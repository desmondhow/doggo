import React, { Component } from 'react';
import '../assets/stylesheets/Profile.css';
import paw from '../assets/images/paw_print.png';
import Button from 'react-bootstrap/Button';
import { getSessionData } from '../assets/api/generalAPI';

class DogProfile extends Component {
    constructor(props) {
        super(props)
        console.log(props.location.state.sessionData)
        // temporary state variables, potential characteristics to store in DB
        this.state = {
            dogId: props.location.state.dogId,
            dogName: props.location.state.dogName,
            age: 4,
            weight: "75lbs",
            rewardType: "tug",
            sessionData: props.location.state.sessionData,
            dogData: {
                UDC: "No sessions",
                LHS: "No sessions",    // dogs for LHS not being stored in DB
                OBD: "No sessions"
            }

        }

    }

    formatSessionData() {

    }

    filterDataByDog() {
        // LHS is not storing dogs TODO
        //UDC
        Object.keys(this.state.dogData).forEach(sessionType => {
            if (sessionType === "UDC") {
                this.setUDCData()
            }
            if (sessionType === "OBD") {
                this.setOBDData()
            }
        })
        console.log(this.state.dogData)
    }

    setUDCData() {
        let dogUDC = []
        this.state.sessionData.UDC.forEach(session => {
            session.dogsTrained.forEach(dogObj => {
                if (dogObj.dogId === this.state.dogId) {
                    dogUDC.push(session)
                }
            })
        })
        if (dogUDC.length !== 0) {
            let data = this.state.dogData;
            data.UDC = dogUDC
            this.setState({ dogData: data })
        }

    }

    setOBDData() {
        let dogOBD = []
        this.state.sessionData.OBD.forEach(session => {
            Object.values(session.dogs).forEach(dogObj => {
                if (dogObj.name.includes(this.state.dogId)) {
                    dogOBD.push(session)
                }
            })
        })
        if (dogOBD.length !== 0) {
            let data = this.state.dogData;
            data.OBD = dogOBD
            this.setState({ dogData: data })
        }
    }
    componentDidMount() {
        // get dog session info

    }
    render() {
        return (
            <div>
                <div className="dog-profile">
                    <div className="profile-photo">
                        <img src={paw}></img>
                    </div>
                    <div className="profile-info">
                        <div><span className="bold">Name:</span> {this.state.dogName} </div>
                        <div><span className="bold">Age:</span> {this.state.age}</div>
                        <div><span className="bold">Weight:</span> {this.state.weight}</div>
                        <div><span className="bold">Reward Type:</span> {this.state.rewardType}</div>
                    </div>
                </div>
                <div className="session-data">
                    <Button onClick={() => this.filterDataByDog()}>Test</Button>
                </div>
            </div>
        )
    }
}

export default DogProfile;