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
                        res.sessions.filter(obj => obj.sessionType === sessionType).map((key, i) => {
                            sessionData.push(key.data)
                        });
                        // // get dogs
                        // routes.loadProfileURL
                        // .then(url => {
                        //     request(url, null, 'GET')
                        //     .then(res => res.json())
                        //     .then(res => {
                        //         let dogObjs = res.dogs;
                        //         sessionData.forEach(session => {
                        //             let dogsTrained = session.dogsTrained;
                        //             let sessionDogs = []
                        //             // dogsTrained.forEach(dog => {
                        //             //     const id = dog.dogId
                        //             //     sessionDogs.push(dogObjs.find((obj) => {
                        //             //         return obj._id === id;
                        //             //     }))
                        //             // })
                        //             // sessionDogs => dog objects for this session
                        //             console.log(dogsTrained)
                        //         })
    
                        //     })
                        // })
                        resolve(sessionData);
                    })
                    .catch(err => {
                        console.log('error get all sessions for', sessionType, err);
                    })
            })
    })

}