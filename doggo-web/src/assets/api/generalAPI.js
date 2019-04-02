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