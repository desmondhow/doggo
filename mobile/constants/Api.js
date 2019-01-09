import {getUserID} from '../components/auth';

HEROKU_API_URL = 'https://doggoplatform.herokuapp.com/api/';
LOCAL_API_URL = 'http://localhost:3010/api/';

// routes
USERS_ROUTE = 'users';
DATA_COLLECTION_ROUTE = 'data_collection';


const formatAPILink = url => LOCAL_API_URL + url;
export default {
    getUDCSession: formatAPILink(DATA_COLLECTION_ROUTE + '/getUDCSession'),
    getCurrentUDCSessions: formatAPILink(DATA_COLLECTION_ROUTE + '/get_all_udc'),
    getLoginApiURL: formatAPILink(USERS_ROUTE + '/login'),
    getRegisterApiURL: formatAPILink(USERS_ROUTE + '/register'),
    getLogoutApiURL: formatAPILink(USERS_ROUTE + '/logout'),
    getProfileApiURL: formatAPILink(USERS_ROUTE + '/profile'),
    getSaveUDCSessionURL: () => {
        return new Promise((res, rej) => {
            getUserID()
                .then((id) => (
                    res(formatAPILink(`${DATA_COLLECTION_ROUTE}/${id}/createUDCSession`))
                ))
                .catch((err) => rej(err))
        })
    }
}