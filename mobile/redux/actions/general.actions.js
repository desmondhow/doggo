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
export const GET_PROFILE = 'GET_PROFILE';
export const RESET_STATE = 'RESET_STATE';


/**
 * Action Creators
 */
export const getProfileData = () => {
    console.log('Getting all data ');
    return (dispatch, getState) => {
        if (isOnline()) {
            API.loadProfileURL
                .then(url => {
                        request(url, null, 'GET')
                            .then(res => res.json())
                            .then(profile => {
                                dispatch({type: GET_PROFILE,  trainers: profile.trainers, dogs: profile.dogs })
                            })
                            .catch(err => {
                                console.log('error getting profile', err);
                                dispatch({type: SERVER_STATE, isServerOnline: false});
                            })
                            .done()
                    }
                ).catch(err => {
            })
        } else {
            console.log('No connection');
        }
    };
};

