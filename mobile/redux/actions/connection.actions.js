// export const GET_UDC_NEW_SESSION_INITIAL_STATE = 'GET_UDC_NEW_SESSION_INITIAL_STATE';
import Constants from "../../constants/Api";
import fetch from 'cross-fetch'
import 'babel-polyfill'
import {getAllUDCLater, saveUDCSession, saveUDCSessionLater} from "./udc.actions";


/**
 * Action types
 */
export const CONNECTION_STATE = 'CHANGE_CONNECTION_STATUS';
export const REMOVE_FROM_ACTION_QUEUE = 'REMOVE_FROM_ACTION_QUEUE';
export const ADD_TO_ACTION_QUEUE = 'ADD_TO_ACTION_QUEUE';
export const SERVER_STATE = 'SERVER_STATE';
export const RESET_STATE = 'RESET_STATE';

export const ActionQueueTypes = {
    GET_ALL_UDC_LATER: 'GET_ALL_UDC_LATER',
    SAVE_NEW_UDC_LATER: 'SAVE_NEW_UDC_LATER'
};

/**
 * Action creators
 * @param status
 * @returns {{type: string, isConnected: *}}
 */
export const connectionState = ({status}) => {
    return {type: CONNECTION_STATE, isConnected: status};
};

export const pingServer = ({url}) => {
    return (dispatch) => {
        fetch(url)
            .then((res) => res.json())
            .then((res) => {
                dispatch({type: SERVER_STATE, isServerOnline: true});
            }).catch(function (error) {
            dispatch({type: SERVER_STATE, isServerOnline: false});
        });
    };
};

/**
 * Dispatches an action creator
 * @param elt
 */
export const dispatchActionQueueElt = ({elts}) => {
    return (dispatch) => {
        for (let i = 0; i < elts.length; i++) {
            switch (elts[i].type) {
                case ActionQueueTypes.GET_ALL_UDC_LATER: {
                    dispatch({type: REMOVE_FROM_ACTION_QUEUE, payload: ActionQueueTypes.GET_ALL_UDC_LATER});
                    dispatch(getAllUDCLater({url: Constants.getCurrentUDCSessions}));
                    return;
                }
                case ActionQueueTypes.SAVE_NEW_UDC_LATER: {
                    dispatch({
                        type: REMOVE_FROM_ACTION_QUEUE, payload: {
                            type: ActionQueueTypes.SAVE_NEW_UDC_LATER,
                            data: elts[i].data
                        }
                    });
                    dispatch(saveUDCSessionLater({sessionInfo: elts[i].data}));
                    return;

                }
                default:
                    console.log('error action queue', elts[i].type);
                    return;

            }
        }
    }
};


/**
 * Checks if both server and internet connection are working
 * @param getState
 * @returns {*|boolean}
 */
export function isOnline(getState) {
    const isConnected = getState().connection.isConnected;
    const isServerOnline = getState().connection.isServerOnline;
    return isConnected && isServerOnline;
}