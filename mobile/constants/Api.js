import {getUserID} from '../components/auth';
import {request} from '../components/helpers';

HEROKU_API_URL = 'https://doggoplatform1.herokuapp.com/api/';
LOCAL_API_URL = 'http://localhost:3010/api/';

// routes
USERS_ROUTE = 'users';
SESSIONS_ROUTE = 'sessions';

const formatAPILink = url =>  { 
  return LOCAL_API_URL + url;
}
const formatUsersRoute = route => (
    new Promise((res, rej) => (
        getUserID()
            .then((id) => (
                res(formatAPILink(`${USERS_ROUTE}/${id}/${route}`))
            ))
            .catch((err) => rej(err))
    ))
);
const formatSessionsRoute = route => (
    new Promise((res, rej) => {
        getUserID()
            .then((id) => (
                res(formatAPILink(`${USERS_ROUTE}/${id}/${SESSIONS_ROUTE}/${route}`))
            ))
            .catch((err) => rej(err))
    })
);


export default routes = {
    // login
    loginURL: formatAPILink(USERS_ROUTE + '/login'),
    registerURL: formatAPILink(USERS_ROUTE + '/register'),
    logoutURL: formatAPILink(USERS_ROUTE + '/logout'),
    // profile
    loadProfileURL: formatUsersRoute('profile'),
    addTrainerURL: formatUsersRoute('profile/add-trainer'),
    deleteTrainerURL: trainerId => formatUsersRoute(`profile/delete-trainer/${trainerId}`),
    addDogURL: formatUsersRoute('profile/add-dog'),
    deleteDogURL: dogId => formatUsersRoute(`profile/delete-dog/${dogId}`),
    // UDC
    UDCCurrentSessionsURL: formatSessionsRoute('udc/get-current-sessions'),
    UDCSaveSessionURL: formatSessionsRoute('udc/create'),
    UDCDeleteSessionURL: sessionId => formatSessionsRoute(`udc/${sessionId}`),
    UDCTrainURL: formatSessionsRoute(`udc/train`),
    LHSCurrentSessionsURL: formatSessionsRoute('lhs/get-current-sessions'),
    LHSSaveSessionURL: formatSessionsRoute('lhs/create'),
    LHSDeleteSessionURL: sessionId => formatSessionsRoute(`lhs/${sessionId}`),
    LHSTrainURL: formatSessionsRoute(`lhs/train`),
    ping: LOCAL_API_URL + 'ping'

}