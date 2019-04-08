// export const GET_UDC_NEW_SESSION_INITIAL_STATE = 'GET_UDC_NEW_SESSION_INITIAL_STATE';
import Constants from "../../constants/Api";
import fetch from 'cross-fetch'
import 'babel-polyfill'
import {
    deleteUDCSessionLater,
    getAllUDCLater,
    saveUDCSession,
    saveUDCSessionLater,
    saveUDCTrainingLater
} from "./udc.actions";
import {deleteLHSSessionLater, saveLHSSessionLater, saveLHSTrainingLater} from "./lhs.actions";


/**
 * Action types
 */
export const CONNECTION_STATE = 'CHANGE_CONNECTION_STATUS';
export const REMOVE_FROM_ACTION_QUEUE = 'REMOVE_FROM_ACTION_QUEUE';
export const ADD_TO_ACTION_QUEUE = 'ADD_TO_ACTION_QUEUE';
export const SERVER_STATE = 'SERVER_STATE';
export const RESET_STATE = 'RESET_STATE';

export const ActionQueueTypes = {
    SAVE_NEW_UDC_LATER: 'SAVE_NEW_UDC_LATER',
    SAVE_NEW_LHS_LATER: 'SAVE_NEW_LHS_LATER',
    DELETE_UDC_LATER: 'DELETE_UDC_LATER',
    DELETE_LHS_LATER: 'DELETE_LHS_LATER',
    SAVE_UDC_TRAINING_LATER: 'SAVE_UDC_TRAINING_LATER',
    SAVE_LHS_TRAINING_LATER: 'SAVE_LHS_TRAINING_LATER'

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
            //Dispatch an action but with a delay of i*2 seconds
            setDelay(i, elts[i], dispatch)
        }
    }
};


function setDelay(i, elts, dispatch) {
    setTimeout(function(){
        console.log('About to dispatch action ', elts);
        if (elts.type === ActionQueueTypes.SAVE_NEW_UDC_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.SAVE_NEW_UDC_LATER,
                    data: elts.data
                }
            });
            dispatch(saveUDCSessionLater({sessionInfo: elts.data}));

        }
        else if (elts.type === ActionQueueTypes.SAVE_NEW_LHS_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.SAVE_NEW_LHS_LATER,
                    data: elts.data
                }
            });
            dispatch(saveLHSSessionLater({sessionInfo: elts.data}));

        }
        else if (elts.type === ActionQueueTypes.DELETE_UDC_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.DELETE_UDC_LATER,
                    data: elts.data
                }
            });
            dispatch(deleteUDCSessionLater({sessionId: elts.data}));
        }

        else if (elts.type === ActionQueueTypes.DELETE_LHS_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.DELETE_LHS_LATER,
                    data: elts.data
                }
            });
            dispatch(deleteLHSSessionLater({sessionId: elts.data}));
        }

        else if (elts.type === ActionQueueTypes.SAVE_UDC_TRAINING_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.SAVE_UDC_TRAINING_LATER,
                    data: elts.data
                }
            });
            dispatch(saveUDCTrainingLater({sessionInfo: elts.data}));

        }

        else if (elts.type === ActionQueueTypes.SAVE_LHS_TRAINING_LATER) {
            dispatch({
                type: REMOVE_FROM_ACTION_QUEUE, payload: {
                    type: ActionQueueTypes.SAVE_LHS_TRAINING_LATER,
                    data: elts.data
                }
            });
            dispatch(saveLHSTrainingLater({sessionInfo: elts.data}));

        }


        else {
            console.log('error action queue', elts.type);
        }

    }, i* 10000);
}


/**
 * Checks if both server and internet connection are working
 * @param getState
 * @returns {*|boolean}
 */
export function isOnline(getState) {

    const isConnected = getState().connection.isConnected;
    const isServerOnline = getState().connection.isServerOnline;

    return isServerOnline && isConnected;
}

export function guidGenerator() {
    /**
     * @return {string}
     */
    let S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
