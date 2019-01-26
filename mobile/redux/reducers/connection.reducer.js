import {InitialValues} from '../../constants/SessionsConstants';
import Constants from "../../constants/Api";
import _ from 'lodash';
import {ADD_TO_ACTION_QUEUE, CONNECTION_STATE, SERVER_STATE, REMOVE_FROM_ACTION_QUEUE} from "../actions/connection.actions";
import {RESET_STATE} from "../actions/udc.actions";

/**
 * Reducer for handling internet connection and offline mode.
 * Uses a queue to keep track  of all the request user has made.
 * @type {{isConnected: boolean, actionQueue: Array}}
 */

const initialState = {
    isConnected: false,
    isServerOnline: false,
    actionQueue: [],
};
//Pessimistic approach to connection status
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CONNECTION_STATE:
            return Object.assign({}, state, {
                isConnected: action.isConnected,
            });
        case SERVER_STATE:
            return Object.assign({}, state, {
                isServerOnline: action.isServerOnline,
            });
        case ADD_TO_ACTION_QUEUE:
            //Check if it already exist
            let eltExist = false;
            let obj;
            if  (action.data !== undefined) {
                obj = {
                    type: action.payload,
                    data: action.data
                };
            } else {
                obj = {
                    type: action.payload,
                };
            }

            for (let i =0; i < state.actionQueue.length; i++) {
                if (JSON.stringify(state.actionQueue[i]) === JSON.stringify(obj)) {
                    eltExist = true;
                    break;
                }
            }
            if (eltExist) {
                return state;
            } else {
                return Object.assign({}, state, {
                    actionQueue: state.actionQueue.concat([obj]),
                });
            }
        case REMOVE_FROM_ACTION_QUEUE:
            console.log('State action queue', state.actionQueue);
            return {
                ...state,
                actionQueue: [...state.actionQueue.slice(1)]
            };
        case RESET_STATE: {
            return {
                ...state,
                isConnected: false,
                isServerOnline: false,
                actionQueue: [],
            };
        }
        default:
            return state
    }
};

export default reducer;