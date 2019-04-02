// const HEROKU_API_URL = 'https://doggoplatform1.herokuapp.com/api/';
const LOCAL_API_URL = 'http://localhost:3010/api/';

// routes
const USERS_ROUTE = 'users';
const SESSIONS_ROUTE = 'sessions';

const formatAPILink = url => {
  return LOCAL_API_URL + url;
}

// const checkForUserID = (promise) => {
//   promise = promise || new Promise(()=> {})
//   const userId = sessionStorage.getItem("userId")
//   if (userId) {
//     promise.resolve(userId)
//   } else {
//     setTimeout(function () {
//       checkForUserID(promise);
//     }, 500);
//   }
// };

const checkForUserID = () => {
  return new Promise(resolve => {
    const userId = sessionStorage.getItem("userId")
    if (userId) {
      console.log("resolving", userId)
      resolve(userId)
    } else {
      setTimeout(function () {
        console.log("inside timeout")
        checkForUserID();
      }, 500);
    }
  })
};

// const getUserID = () => {
//   return new Promise(resolve => {
//     checkForUserID()
//       .then(() => {
//         // do something
//         console.log("about to resolve get")
//         resolve()
//       })
//   })

// }

const getUserID = () => {
  return sessionStorage.getItem("userId")
}

const formatUsersRoute = route => (
  new Promise((res, rej) => {
    // getUserID()
    //   .then(id => {
    //     console.log("id found", id)
    const id = getUserID();
    res(formatAPILink(`${USERS_ROUTE}/${id}/${route}`))
    .catch((err) => rej(err))
  })
    
);
const formatSessionsRoute = route => (
  new Promise((res, rej) => {
    const id = getUserID()
    res(formatAPILink(`${USERS_ROUTE}/${id}/${SESSIONS_ROUTE}/${route}`))
      .catch((err) => rej(err))
  })
);

const routes = {
  // login
  loginURL: formatAPILink(USERS_ROUTE + '/login'),
  registerURL: formatAPILink(USERS_ROUTE + '/register'),
  logoutURL: formatAPILink(USERS_ROUTE + '/logout'),
  // // profile
  loadProfileURL: formatUsersRoute('profile'),
  // addTrainerURL: formatUsersRoute('profile/add-trainer'),
  // deleteTrainerURL: trainerId => formatUsersRoute(`profile/delete-trainer/${trainerId}`),
  // addDogURL: formatUsersRoute('profile/add-dog'),
  // deleteDogURL: dogId => formatUsersRoute(`profile/delete-dog/${dogId}`),
  // // UDC
  UDCCurrentSessionsURL: formatSessionsRoute('udc/get-current-sessions'),
  // UDCSaveSessionURL: formatSessionsRoute('udc/create'),
  // UDCDeleteSessionURL: sessionId => formatSessionsRoute(`udc/${sessionId}`),
  // UDCTrainURL: formatSessionsRoute(`udc/train`),
  // // LHS
  LHSCurrentSessionsURL: formatSessionsRoute('lhs/get-current-sessions'),
  // LHSSaveSessionURL: formatSessionsRoute('lhs/create'),
  // LHSDeleteSessionURL: sessionId => formatSessionsRoute(`lhs/${sessionId}`),
  // LHSTrainURL: formatSessionsRoute(`lhs/train`),
  // // OBD
  OBDCurrentSessionsURL: formatSessionsRoute('obd/get-current-sessions'),
  // OBDSaveSessionURL: formatSessionsRoute('obd/create'),
  // OBDDeleteSessionURL: sessionId => formatSessionsRoute(`obd/${sessionId}`),
  // OBDTrainURL: formatSessionsRoute(`obd/train`),
  // // ping
  // ping: LOCAL_API_URL + 'ping'
}

export default routes;