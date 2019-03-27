import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import { request } from '../assets/helpers';
import routes from '../Api';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    getUDC = event => {
        event.preventDefault();
        routes.UDCCurrentSessionsURL
            .then(url => {
                request(url, null, 'GET')
                    .then(res => res.json())
                    .then(res => {
                        let sessionData = [];
                        res.sessions.map((key, i) => {
                            sessionData.push(key.data)
                        });
                        console.log(sessionData);
                        return sessionData;
                    })
                    .catch(err => {
                        console.log('error get all udc', err);
                    })
            })
    }

    render() {
        return (
            <div>
                <Button type="button" onClick={this.getUDC}>Get UDC</Button>
            </div >
        )
    }
}

export default Home;