import React, { Component } from 'react';
import GeneralInfo from '../components/GeneralInfo';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { udcPerformance } from '../assets/constants';
import Form from 'react-bootstrap/Form';
import { updateSession } from '../assets/api/generalAPI';

class UDCSession extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
        this.state = {
            session: this.props.location.state.session,
            dogData: this.props.location.state.dogData,
            dogName: this.props.location.state.dogName,
            isEditing: this.props.location.pathname.includes("edit") ? true : false
        }

        // this.handleChange.bind(this)
        // this.handleEdit.bind(this)
        console.log(this.state)
    }

    handleChange(event) {
        const id = event.nativeEvent.target.id;
        const hideId = id.split("-")[0];
        const field = id.split("-")[1];
        let value = id.split("-")[2];
        const performance = this.getPerformance(hideId);
        if (!value) {
            // is a dropdown
            value = event.nativeEvent.target.value;
            if(field === "barks") {
                value = parseInt(value)
            }
            performance[field] = value;
        } else {
            // is a checkbox
            const checked = event.nativeEvent.target.checked;
            if(value === "fields") {
                // true/false change
                if(checked){
                    performance[field] = true
                } else {
                    delete performance[field]
                }
                 
            } else {
                // array update
                if(checked) {
                    performance[field].push(value)
                } else {
                    const i = performance[field].indexOf(value)
                    performance[field].splice(i, 1)
                }
                
            }
        }
        const sessionCopy = this.state.session;
        sessionCopy.dogsTrained.find(obj => obj.dogId === this.state.dogData.dogId).hides.find(hide => hide.hideId === hideId).performance = performance;
        this.setState({session: sessionCopy});
    }

    onSubmit(event) {
        event.preventDefault();
        updateSession("UDC", this.state.session)
            .then(console.log("finished?"))
        
    }

    getPerformance(hideId) {
        const dogObj = this.state.session.dogsTrained.find(obj => obj.dogId === this.state.dogData.dogId)
        const hide = dogObj.hides.find(hide => hide.hideId === hideId)
        const performance = hide.performance;
        return performance;
    }

    formatDropdown(performance, hideId, fieldArr, constant) {
        return (
            <Form.Group controlId={`${hideId}-${constant}`} onChange={this.handleChange.bind(this)}>
                {/* <Form.Label>{label}</Form.Label> */}
                <Form.Control as="select" defaultValue={performance[constant]}>
                    {fieldArr.map(field => {
                        return (
                            <option>{field}</option>
                        )
                    })}
                </Form.Control>
            </Form.Group>
        )
    }

    formatRangeDropdown(performance, hideId, num, constant, order) {
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
            <Form.Group controlId={`${hideId}-${constant}`} onChange={this.handleChange.bind(this)} defaultValue={performance[constant]}>
                <Form.Control as="select">
                    {options}
                </Form.Control>
            </Form.Group>
        )
    }

    formatCheckboxes(performance, hideId, fieldArr, constant, useDb) {
        const checked = performance[constant];
        // true or undefined
        return (
            <Form.Group controlId={`${hideId}-${constant}`} onChange={this.handleChange.bind(this)}>
                <div className="scroll-box">
                    {fieldArr.map(field => {
                        let identifier = `${constant}-${field.label}`
                        if (useDb) {
                            identifier = `${field.db}-${constant}`
                        }
                        if ((!checked && performance[field.db]) || (checked && checked.includes(field.label))) {
                            return (
                                <Form.Check
                                    type="checkbox"
                                    id={`${hideId}-${identifier}`}
                                    label={field.label}
                                    value={field.label}
                                    checked={true}
                                />
                            )
                        } else {
                            return (
                                <Form.Check
                                    type="checkbox"
                                    id={`${hideId}-${identifier}`}
                                    label={field.label}
                                    value={field.label}
                                />
                            )
                        }

                    })}
                </div>
            </Form.Group>
        )
    }

    renderSessionInfo() {
        return (
            <div className="info-list">
                <h3>Session Info</h3>
                <div><span className="bold">Handler:</span> {this.state.dogData.handler} </div>
                <div><span className="bold">Recorder:</span> {this.state.dogData.recorder}</div>
                <div><span className="bold">Handler Knows:</span> {this.state.dogData.handlerKnows.text}</div>
                <div><span className="bold">On Lead:</span> {this.state.dogData.onLead.text}</div>
            </div>
        )
    }


    renderHide(hide) {
        return (
            // <Col key={hide.id}>
            <Table>
                <thead>
                    <tr>
                        <th>{hide.hideType} Hide</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="bold">Room Number:</span>{hide.roomNumber}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Concentration:</span>{hide.concentration}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Size:</span>{hide.size}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Location:</span>{hide.location}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Placement Area:</span>{hide.placementArea}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Placement Height:</span>{hide.placementHeight}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Concealed: </span>{hide.isConcealed === 1 ? "Yes" : "No"}
                        </td>
                    </tr>
                </tbody>
            </Table>
            // {/* </Col> */}
        )
    }

    renderPerformance(performance, hideId) {
        let distractions = ""
        performance.distractions.forEach(d => {
            distractions += d + ", "
        })

        let failCodes = ""
        performance.failCodes.forEach(f => {
            failCodes += f + ", "
        })
        return (
            // <Col key={hideId}>

            <Table>
                <thead>
                    <tr>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className="bold">Radius Alert: </span>{this.state.isEditing ? this.formatDropdown(performance, hideId, udcPerformance.HandlerRadius, "radiusAlert") : performance.radiusAlert}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Radius Reward: </span>{this.state.isEditing ? this.formatDropdown(performance, hideId, udcPerformance.HandlerRadius, "radiusReward") : performance.radiusReward}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Radius Search: </span>{this.state.isEditing ? this.formatDropdown(performance, hideId, udcPerformance.HandlerRadius, "radiusSearch") : performance.radiusSearch}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Rewarder: </span>{this.state.isEditing ? this.formatDropdown(performance, hideId, ["Trainer", "Handler"], "rewarder") : performance.rewarder}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Number of Barks: </span>{this.state.isEditing ? this.formatRangeDropdown(performance, hideId, 40, "barks", 1) : performance.barks}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Distractions: </span>{this.state.isEditing ? this.formatCheckboxes(performance, hideId, udcPerformance.Distractions, "distractions") : distractions}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span className="bold">Failure Codes: </span>{this.state.isEditing ? this.formatCheckboxes(performance, hideId, udcPerformance.FailCodes, "failCodes") : failCodes}
                        </td>
                    </tr>
                    {this.state.isEditing ?
                        <tr>
                            <td>
                                <span className="bold">Select all that apply: </span>{this.formatCheckboxes(performance, hideId, udcPerformance.Fields, "fields", true)}
                            </td>
                        </tr>
                        :
                        (<>
                            <tr>
                                <td>
                                    <span className="bold">Fringe: </span>{performance.fringe ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="bold">Reset: </span>{performance.reset ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="bold">False Alert: </span>{performance.falseAlert ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="bold">False Indication: </span>{performance.falseIndication ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="bold">Detail Search: </span>{performance.detailSearch ? "Yes" : "No"}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className="bold">Successful: </span>{performance.successful ? "Yes" : "No"}
                                </td>
                            </tr>
                        </>)
                    }
                </tbody>
            </Table>

            // {/* </Col> */}
        )
    }

    createTables() {
        const hideTables = []
        const hideRoomNumbers = []
        const performanceTables = []
        const tables = []
        this.state.session.hides.forEach(hide => {
            // hideTables.push(this.renderHide(hide))
            // hideRoomNumbers.push(hide.roomNumber)
            tables.push(this.renderHide(hide))
            const performance = this.state.dogData.hides[hide.roomNumber].performance
            // if (this.state.isEditing) {
            //     tables.push(this.renderPerformanceForm(performance, hide.roomNumber))
            // } else {
            tables.push(this.renderPerformance(performance, hide.roomNumber))
            // }

        })
        // hideRoomNumbers.forEach(hideId => {
        //     const performance = this.state.dogData.hides[hideId].performance
        //     performanceTables.push(this.renderPerformance(performance, hideId))
        // })

        // return {hideTables: hideTables, performanceTables: performanceTables}
        return tables;
    }

    handleEdit() {
        this.props.history.push({
            pathname: "/editUDCSession",
            state: { session: this.state.session, dogName: this.state.dogName, dogData: this.state.dogData }
        })
        this.setState({ isEditing: true })
    }

    render() {
        const tables = this.createTables();
        return (
            <div>
                <h3>UDC Session for {this.state.dogName}</h3>
                <Button onClick={this.handleEdit.bind(this)}>Edit Session</Button>
                <GeneralInfo session={this.state.session} />

                <Row>
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        {tables}
                        {this.state.isEditing ? <Button type="submit">Update</Button> : ""}
                    </Form>
                </Row>
                {/* <Row>
                    {tables.performanceTables}
                </Row> */}
            </div>
        )
    }
}

export default UDCSession;