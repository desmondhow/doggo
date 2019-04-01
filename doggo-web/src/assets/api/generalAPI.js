import routes from './Api';
import { request } from '../helpers';

export const getDogs = () => {
    return new Promise((resolve, reject) => {
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