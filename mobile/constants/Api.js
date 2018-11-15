// API_URL = 'https://doggo.herokuapp.com/api/';
SERVER_URL = 'http://localhost:3000/api/';
USERS_ROUTE = 'users';

const formatAPILink = ((url) => {
    return SERVER_URL + url;
});

export default {
    getAllSessions: formatAPILink('getAllSessions'),
    getCurrentUDCSessions: formatAPILink('getCurrentUDCSessions'),
    getLoginApiURL: formatAPILink(USERS_ROUTE + '/login')

}