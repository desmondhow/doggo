// export const GET_UDC_NEW_SESSION_INITIAL_STATE = 'GET_UDC_NEW_SESSION_INITIAL_STATE';
import API from "../../constants/Api";
import fetch from 'cross-fetch'
import 'babel-polyfill'
import {
    ActionQueueTypes,
    ADD_TO_ACTION_QUEUE,
    SERVER_STATE,
    isOnline,
} from "./connection.actions";
import {request} from "../../components/helpers";

/**
 * Action types
 */
export const SAVE_UDC_SESSION = 'SAVE_UDC_SESSION';
export const GET_ALL_UDC = 'GET_ALL_UDC';
export const DELETE_UDC_SESSION = 'DELETE_UDC_SESSION';
export const UPDATE_UDC_SESSION = 'UPDATE_UDC_SESSION';
export const RESET_STATE = 'RESET_STATE';
export const SAVE_UDC_TRAINING = 'SAVE_UDC_TRAINING';


/**
 * Action Creators
 */
export const getAllUDC = () => {
    console.log('Getting all udc sessions');
    return (dispatch, getState) => {
        if (isOnline()) {
            API.UDCCurrentSessionsURL
                .then(url => {
                        request(url, null, 'GET')
                            .then(res => res.json())
                            .then(res => {
                                let sessionData = [];
                                res.sessions.map((key, i) => {
                                    sessionData.push(key.data)
                                });
                                dispatch({type: GET_ALL_UDC, sessions: sessionData})
                            })
                            .catch(err => {
                                console.log('error get all udc', err);
                                dispatch({type: SERVER_STATE, isServerOnline: false});
                            })
                            .done()
                    })
                .catch(err => {})
        } else {
            console.log('No connection');
        }
    };
};


/**
 * Saves a UDC session. If there is no connection, session is saved locally and pushed to db once there is connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveUDCSession = ({sessionInfo}) => {
    return (dispatch, getState) => {
        //Transform session info
        sessionInfo.hides = parseHides(sessionInfo.hides);
        //We save it locally first
        if (!sessionInfo.isNew) {
            console.log('Updating session');
            dispatch({type: UPDATE_UDC_SESSION, sessionInfo: sessionInfo});
        } else {
            console.log('Creating new session');
            dispatch({type: SAVE_UDC_SESSION, sessionInfo: sessionInfo});
        }

        if (isOnline()) {
            API.UDCSaveSessionURL.then(url => {
                request(url, JSON.stringify(sessionInfo))
                    .then(res => {
                    })
                    .catch(err => {
                        console.log('error save now', err);
                        dispatch({type: SERVER_STATE, isServerOnline: false});
                        dispatch({
                            type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER,
                            data: sessionInfo
                        });
                    });
            }).catch(err => {})
        } else {
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER, data: sessionInfo});
        }
    };
};


export const saveUDCSessionLater = ({sessionInfo}) => {
    return (dispatch) => {
        API.UDCSaveSessionURL.then(url =>
            request(url, JSON.stringify(sessionInfo))
                .then(res => {
                })
                .catch(err => {
                    console.log('error save later', err);
                    dispatch({type: SERVER_STATE, isServerOnline: false});
                    dispatch({
                        type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER,
                        data: sessionInfo
                    });
                })
        )

    }
};


export const deleteUDCSession = ({sessionId}) => {
    return (dispatch, getState) => {
        //We first delete it locally
        dispatch({type: DELETE_UDC_SESSION, sessionId: sessionId});
        if (isOnline()) {
            API.UDCDeleteSessionURL(sessionId).then(url => {
                request(url, JSON.stringify({sessionId: sessionId}))
                    .then(res => {
                    })
                    .catch(err => {
                        console.log('error delete now', err);
                        dispatch({type: SERVER_STATE, isServerOnline: false});
                        dispatch({
                            type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.DELETE_UDC_LATER,
                            data: sessionId
                        });
                    });
            }).catch(err => {})

        } else {
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.DELETE_UDC_LATER, data: sessionId});
        }
    };
};


export const deleteUDCSessionLater = ({sessionId}) => {
    return (dispatch) => {
        API.UDCDeleteSessionURL(sessionId).then(url => {
                request(url, JSON.stringify({sessionId: sessionId}))
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log('error delete later', err);
                        dispatch({type: SERVER_STATE, isServerOnline: false});
                        dispatch({
                            type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.DELETE_UDC_LATER,
                            data: sessionId
                        });

                    })
            }
        )

    }
};


/**
 * Saves a UDC Training session. If there is no connection, session is saved locally and pushed to db once there is
 * connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveUDCTraining = ({sessionInfo}) => {
    return (dispatch, getState) => {

        sessionInfo = parseTrainingData(sessionInfo);
        console.log('sessionm info after edit', sessionInfo);
        //We save it locally first
        dispatch({type: UPDATE_UDC_SESSION, sessionInfo: sessionInfo});
        if (isOnline()) {
            API.UDCTrainURL.then(url => {
                console.log(url);
                request(url, JSON.stringify({sessionId: this.state.sessionId, sessionInfo: sessionInfo}), 'POST')
                    .then(res => {
                    })
                    .catch(err => {
                        console.log('error train now', err);
                        dispatch({type: SERVER_STATE, isServerOnline: false});
                        dispatch({
                            type: ADD_TO_ACTION_QUEUE,
                            payload: ActionQueueTypes.SAVE_UDC_TRAINING_LATER,
                            data: sessionInfo
                        });
                    });
            }).catch(err => {})


        } else {
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_UDC_TRAINING_LATER, data: sessionInfo});
        }
    };
};


export const saveUDCTrainingLater = ({sessionInfo}) => {
    return (dispatch) => {
        API.UDCTrainURL.then(url =>
            request(url, JSON.stringify({sessionId: this.state.sessionId, sessionInfo: sessionInfo}), 'POST')
                .then(res => {
                })
                .catch(err => {
                    console.log('error save training later', err);
                    dispatch({type: SERVER_STATE, isServerOnline: false});
                    dispatch({
                        type: ADD_TO_ACTION_QUEUE,
                        payload: ActionQueueTypes.SAVE_UDC_TRAINING_LATER,
                        data: sessionInfo
                    });
                })
        )

    }
};


const parseHides = hidesData => {
  let hides = [];
  Object.keys(hidesData).forEach(roomNumber => {
    const h = hidesData[roomNumber];
    let concentration = h.concentration;
    let size = h.size;
    let location = h.location;
    let isConcealed = h.isConcealed;
    let placementArea = h.placementArea;
    let placementHeight = h.placementHeight;
    let hideType = h.hideType;

    hides.push({
      roomNumber,
      concentration: Number(concentration),
      size,
      location,
      isConcealed,
      placementArea,
      placementHeight,
      hideType
    });
  });
  return hides;
};


const parseTrainingData = sessionInfo => {

    Object.keys(sessionInfo).forEach(dogId => {
        if (!!sessionInfo[dogId]['trainer']['_id']) {
            sessionInfo[dogId]['trainerId'] = sessionInfo[dogId]['trainer']['_id'];
        }
        Object.keys(sessionInfo[dogId]['performance']).forEach(hideId => {
            Object.keys(sessionInfo[dogId]['performance'][hideId]).forEach(field => {
                const hideInfo = sessionInfo[dogId]['performance'][hideId];
                if (typeof hideInfo[field] === 'object') {
                    if (!!hideInfo[field]['text']) {
                        sessionInfo[dogId]['performance'][hideId][field] = hideInfo[field]['text'];
                    }
                }
            })
        });
    });
    return sessionInfo;

};

