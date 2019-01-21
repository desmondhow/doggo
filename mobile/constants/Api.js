import {getUserID} from '../components/auth';

HEROKU_API_URL = 'https://doggoplatform.herokuapp.com/api/';
LOCAL_API_URL = 'http://localhost:3010/api/';

// routes
USERS_ROUTE = 'users';
SESSIONS_ROUTE = 'sessions';

const formatAPILink = url => LOCAL_API_URL + url;
const formatUsersRoute = route => (
  new Promise((res, rej) => (
    getUserID()
    .then((id) => (
      res(formatAPILink(`${USERS_ROUTE}/${id}/${route}`))
    ))
    .catch((err) => rej(err))
  ))
)
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
  UDCSessionURL: formatAPILink(formatSessionsRoute('udc/get-session')),
  currentUDCSessionsURL: formatSessionsRoute('udc/get-current-sessions'),
  loginURL: formatAPILink(USERS_ROUTE + '/login'),
  registeURL: formatAPILink(USERS_ROUTE + '/register'),
  logoutURL: formatAPILink(USERS_ROUTE + '/logout'),
  profileURL: formatAPILink(USERS_ROUTE + '/profile'),
  saveUDCSessionURL: formatSessionsRoute('udc/create-new-session'),
  deleteUDCSessionURL: sessionId =>  formatSessionsRoute(`udc/delete-session/${sessionId}`),
  loadProfileURL: formatUsersRoute('profile'),
  addTrainerURL: formatUsersRoute('profile/add-trainer'),
  deleteTrainerURL: trainerId => formatUsersRoute(`profile/delete-trainer/${trainerId}`),
  addDogURL: formatUsersRoute('profile/add-dog'),
  deleteDogURL: dogId => formatUsersRoute(`profile/delete-dog/${dogId}`),
}