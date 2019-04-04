import routes from './Api';
import { request } from '../helpers';

export const getDogs = () => {
    // console.log("get dogs")
    return new Promise((resolve) => {
        // console.log(routes.loadProfileURL)
        routes.loadProfileURL
            .then(url => {
                request(url, null, 'GET')
                    .then(res => res.json())
                    .then(res => {
                        resolve(res.dogs);
                    })
            })
    })

}

export const getDogSessions = (dogId) => {

}

// takes in sessionType - relying on this parameter matching URL and sessionType in database
export const getSessionData = (sessionType) => {
    return new Promise(resolve => {
        const apiURL = sessionType + "CurrentSessionsURL";
        routes[apiURL]
            .then(url => {
                request(url, null, 'GET')
                    .then(res => res.json())
                    .then(res => {
                        let sessionData = [];
                        res.sessions.forEach(key => {
                            sessionData.push(key.data)
                        });
                        resolve(sessionData);
                    })
                    .catch(err => {
                        console.log('error get all sessions for', sessionType, err);
                    })
            })
    })

}

export const updateSession = (sessionType, sessionData) => {
    return new Promise(resolve => {
        const apiURL = sessionType + "SaveSessionURL";
        routes[apiURL]
            .then(url => {
                sessionData.isNew = false;
                request(url, { sessionInfo: sessionData }, 'POST')
                    .then(res => res.json())
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log('error updating session for', sessionType, err);
                    })
            })
    })
}