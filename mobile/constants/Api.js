API_URL = 'https://doggoplatform.herokuapp.com/api/';
USERS_ROUTE = 'users';

const formatAPILink = ((url) => {
    return API_URL + url;
});

export default {
    getAllSessions: formatAPILink('getAllSessions'),
    getCurrentUDCSessions: formatAPILink('getCurrentUDCSessions'),
    getLoginApiURL: formatAPILink(USERS_ROUTE + '/login'),
    getRegisterApiURL: formatAPILink(USERS_ROUTE + '/register'),
    getLogoutApiURL: formatAPILink(USERS_ROUTE + '/logout'),
    getProfileApiURL: formatAPILink(USERS_ROUTE + '/profile')

}