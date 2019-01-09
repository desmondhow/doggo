import { getUserID } from '../components/auth';

HEROKU_API_URL = 'https://doggoplatform.herokuapp.com/api/';
LOCAL_API_URL = 'http://localhost:3000/api/';

// routes
USERS_ROUTE = 'users';

const formatAPILink = url => LOCAL_API_URL + url;
export default {
  getAllSessions: formatAPILink('getAllSessions'),
  getCurrentUDCSessions: formatAPILink('getCurrentUDCSessions'),
  getLoginApiURL: formatAPILink(USERS_ROUTE + '/login'),
  getRegisterApiURL: formatAPILink(USERS_ROUTE + '/register'),
  getLogoutApiURL: formatAPILink(USERS_ROUTE + '/logout'),
  getProfileApiURL: formatAPILink(USERS_ROUTE + '/profile'),
  getSaveUDCSessionURL: () => { return new Promise((res, rej) => {
    getUserID()
    .then((id) => (
      res(formatAPILink(`${USERS_ROUTE}/${id}/createUDCSession`))
    ))
    .catch((err) => rej(err))
  })}
}