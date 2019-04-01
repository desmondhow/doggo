import routes from './Api';
import { request } from '../helpers';

export const getUDC = event => {
    event.preventDefault();
    routes.UDCCurrentSessionsURL
        .then(url => {
            request(url, null, 'GET')
                .then(res => res.json())
                .then(res => {
                    let sessionData = [];
                    res.sessions.filter(obj => obj.sessionType === "UDC").map((key, i) => {
                        sessionData.push(key.data)
                    });
                    // get dogs
                    routes.loadProfileURL
                    .then(url => {
                        request(url, null, 'GET')
                        .then(res => res.json())
                        .then(res => {
                            let dogObjs = res.dogs;
                            sessionData.forEach(session => {
                                let dogsTrained = session.dogsTrained;
                                let sessionDogs = []
                                dogsTrained.forEach(dog => {
                                    const id = dog.dogId
                                    sessionDogs.push(dogObjs.find((obj) => {
                                        return obj._id === id;
                                    }))
                                })
                                // sessionDogs => dog objects for this session
                                console.log(sessionDogs)
                            })

                        })
                    })
                    return sessionData;
                })
                .catch(err => {
                    console.log('error get all udc', err);
                })
        })
}

