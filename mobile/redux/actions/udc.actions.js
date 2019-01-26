// export const GET_UDC_NEW_SESSION_INITIAL_STATE = 'GET_UDC_NEW_SESSION_INITIAL_STATE';
import Constants from "../../constants/Api";
import fetch from 'cross-fetch'
import 'babel-polyfill'
import {
    ActionQueueTypes,
    ADD_TO_ACTION_QUEUE,
    CONNECTION_STATE,
    REMOVE_FROM_ACTION_QUEUE,
    SERVER_STATE,
    isOnline,
} from "./connection.actions";

/**
 * Action types
 */
export const SAVE_UDC_SESSION = 'SAVE_UDC_SESSION';
export const DELETE_UDC_SESSION = 'DELETE_UDC_SESSION';
export const UPDATE_NEW_UDC_SESSION_HIDE = 'UPDATE_NEW_UDC_SESSION_HIDE_STATE';
export const GET_ALL_UDC = 'GET_ALL_UDC';
export const ADD_NEW_UDC_SESSION_HIDE = 'ADD_NEW_UDC_SESSION_HIDE';
export const RESET_STATE = 'RESET_STATE';


/**
 * Action Creators
 */
export const getAllUDC = ({url}) => {
    console.log(url);
    console.log('Getting all udc sessions');
    return (dispatch, getState) => {
        if (isOnline(getState)) {
            fetch(url)
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    dispatch({type: GET_ALL_UDC, sessions: res});
                }).catch(function (error) {
                    console.log('error get all udc', error);
                dispatch({type: SERVER_STATE, isServerOnline: false});
                dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.GET_ALL_UDC_LATER});
            });
        } else {
            console.log('No connection');
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.GET_ALL_UDC_LATER});
        }
    };
};

export const getAllUDCLater = ({url}) => {
    console.log('url', (url.done()));
    console.log('Getting all udc sessions LATER');

    return (dispatch) => {
        fetch(url.done())
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                console.log('It  WOrked UDC Later');
                console.log(response);
                dispatch({type: GET_ALL_UDC, sessions: response});
            }).catch(function (error) {
            console.log('NOPE');
            console.log(error);

            dispatch({type: SERVER_STATE, isServerOnline: false});
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.GET_ALL_UDC_LATER});
        });
    }
};


/**
 * Saves a UDC session. If there is no connection, session is saved locally and pushed to db once there is connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveUDCSession = ({sessionInfo}) => {
    return (dispatch, getState) => {
        console.log(sessionInfo);
        //Transform session info
        sessionInfo.hides = parseHides(sessionInfo.hides);
        //We save it locally first
        dispatch({type: SAVE_UDC_SESSION, sessionInfo: sessionInfo});
        if (isOnline(getState)) {
            Constants.saveUDCSessionURL
                .then(url => (
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(sessionInfo)
                    })
                ))
                .then((res) => {})
                .catch(err => {
                    dispatch({type: SERVER_STATE, isServerOnline: false});
                    dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER,
                        data: sessionInfo});
                });

        } else {
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER, data: sessionInfo});
        }
    };
};


export const saveUDCSessionLater = ({sessionInfo}) => {
    return (dispatch) => {
        Constants.saveUDCSessionURL
            .then(url => (
                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sessionInfo)
                })
            ))
            .catch(function () {
            dispatch({type: SERVER_STATE, isServerOnline: false});
            dispatch({type: ADD_TO_ACTION_QUEUE, payload: ActionQueueTypes.SAVE_NEW_UDC_LATER, data: sessionInfo});
        });
    }
};




const parseHides = hidesData => {
    let hides = [];
    Object.keys(hidesData).forEach(concentration => {
        let concentrationSizes = hidesData[concentration];
        Object.keys(concentrationSizes).forEach(size => {
            let location = concentrationSizes[size].location;
            let isConcealed = concentrationSizes[size].isConcealed;
            let placementArea = concentrationSizes[size].placementArea;
            let placementHeight = concentrationSizes[size].placementHeight;

            hides.push({
                concentration: Number(concentration),
                size,
                location,
                isConcealed,
                placementArea,
                placementHeight
            });
        });
    });
    return hides;
};


