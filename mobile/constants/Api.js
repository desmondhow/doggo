import {getUserID} from '../components/auth';

HEROKU_API_URL = 'https://doggoplatform.herokuapp.com/api/';
LOCAL_API_URL = 'http://localhost:3010/api/';

// routes
USERS_ROUTE = 'users';
SESSIONS_ROUTE = 'sessions';

const formatAPILink = url => LOCAL_API_URL + url;
const formatSessionsRoute = route => (
  new Promise((res, rej) => {
    getUserID()
      .then((id) => (
          res(formatAPILink(`${USERS_ROUTE}/${id}/${SESSIONS_ROUTE}/${route}`))
      ))
      .catch((err) => rej(err))
  })
)

export default {
  getUDCSession: formatAPILink(formatSessionsRoute('udc/get-session')),
  getCurrentUDCSessions: formatSessionsRoute('udc/get-current-sessions'),
  loginApiURL: formatAPILink(USERS_ROUTE + '/login'),
  registerApiURL: formatAPILink(USERS_ROUTE + '/register'),
  logoutApiURL: formatAPILink(USERS_ROUTE + '/logout'),
  profileApiURL: formatAPILink(USERS_ROUTE + '/profile'),
  saveUDCSessionURL: formatSessionsRoute('udc/create-new-session')
}