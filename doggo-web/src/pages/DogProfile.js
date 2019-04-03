import React, { Component } from 'react';
import '../assets/stylesheets/Profile.css';
import paw from '../assets/images/paw_print.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

import { sessionTypeToName } from '../assets/constants';

class DogProfile extends Component {
    constructor(props) {
        super(props)
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

    setDogData() {
        // LHS is not storing dogs TODO
        Object.keys(this.state.dogData).forEach(sessionType => {
            if (sessionType === "UDC") {
                this.setUDCData()
            }
            if (sessionType === "OBD") {
                this.setOBDData()
            }
        })
        // console.log(this.state.dogData)
    }

    setUDCData() {
        let dogUDC = []
        this.state.sessionData.UDC.forEach(session => {
            Object.keys(session.dogsTrained).forEach(dogId => {
                if (dogId === this.state.dogId) {
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
        this.setDogData()
    }

    render() {
        const sessionTypes = Object.keys(this.state.dogData)

        const tables = []
        sessionTypes.forEach(type => {
            const colName = sessionTypeToName[type];
            const data = this.state.dogData[type];
            const dataRows = []
            if (data === "No sessions") {
                dataRows.push(
                    <tr key={type+"None"}>
                        <td colSpan="3">No sessions</td>
                    </tr>
                )
            } else {
                data.forEach(session => {
                    const date = new Date(session.createdAt)
                    const createdAt = date.toLocaleString();
                    dataRows.push(
                        <tr key={session.sessionId}>
                            <td>{createdAt}</td>
                            <td><Link to={{pathname: "/view"+type+"Session", state: {session: session}}}>View</Link></td>
                            <td><Link to={{pathname: "/edit"+type+"Session", state: {session: session}}}>Edit</Link></td>
                        </tr>
                    )
                })
            }
            tables.push(
                <Col key={type}>
                    <Table>
                        <thead>
                            <tr>
                                <th colSpan="3">{colName}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRows}
                        </tbody>
                    </Table>
                </Col>
            )
        })

        return (
            <div>
                <div className="dog-profile">
                    <div className="profile-photo">
                        <img src={paw} alt=""></img>
                    </div>
                    <div className="profile-info">
                        <div><span className="bold">Name:</span> {this.state.dogName} </div>
                        <div><span className="bold">Age:</span> {this.state.age}</div>
                        <div><span className="bold">Weight:</span> {this.state.weight}</div>
                        <div><span className="bold">Reward Type:</span> {this.state.rewardType}</div>
                    </div>
                </div>
                <div className="session-data">
                    <Row>
                        {tables}
                    </Row>
                </div>
            </div>
        )
    }
}

export default DogProfile;