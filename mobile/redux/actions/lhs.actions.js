// export const GET_LHS_NEW_SESSION_INITIAL_STATE = 'GET_LHS_NEW_SESSION_INITIAL_STATE';
import API from "../../constants/Api";
import fetch from "cross-fetch";
import "babel-polyfill";
import {
  ActionQueueTypes,
  ADD_TO_ACTION_QUEUE,
  SERVER_STATE,
  isOnline
} from "./connection.actions";
import { request } from "../../components/helpers";

/**
 * Action types
 */
export const SAVE_LHS_SESSION = "SAVE_LHS_SESSION";
export const GET_ALL_LHS = "GET_ALL_LHS";
export const DELETE_LHS_SESSION = "DELETE_LHS_SESSION";
export const UPDATE_LHS_SESSION = "UPDATE_LHS_SESSION";
export const RESET_STATE = "RESET_STATE";

export const SAVE_LHS_DOG = "SAVE_LHS_DOG";
export const SAVE_LHS_DOG_TRAINING = "SAVE_LHS_DOG_TRAINING";

/**
 * Action Creators
 */
export const getAllLHS = () => {
  console.log("Getting all lhs sessions");
  return (dispatch, getState) => {
    if (isOnline()) {
      API.LHSCurrentSessionsURL.then(url => {
        request(url, null, "GET")
          .then(res => res.json())
          .then(res => {
            let sessionData = [];
            res.sessions.map((key, i) => {
              sessionData.push(key.data);
            });
            dispatch({ type: GET_ALL_LHS, sessions: sessionData });
          })
          .catch(err => {
            console.log("error get all lhs", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
          })
          .done();
      });
    } else {
      console.log("No connection");
    }
  };
};

/**
 * Saves a LHS session. If there is no connection, session is saved locally and pushed to db once there is connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveLHSSession = ({ sessionInfo }) => {
  return (dispatch, getState) => {
    //Transform session info
    sessionInfo.searches = parseSearches(sessionInfo.searches);
    //We save it locally first
    if (!sessionInfo.isNew) {
      console.log("Updating session");
      dispatch({ type: UPDATE_LHS_SESSION, sessionInfo: sessionInfo });
    } else {
      console.log("Creating new session");
      dispatch({ type: SAVE_LHS_SESSION, sessionInfo: sessionInfo });
    }

    if (isOnline()) {
      API.LHSSaveSessionURL.then(url => {
        request(url, JSON.stringify(sessionInfo))
          .then(res => {})
          .catch(err => {
            console.log("error save now", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
            dispatch({
              type: ADD_TO_ACTION_QUEUE,
              payload: ActionQueueTypes.SAVE_NEW_LHS_LATER,
              data: sessionInfo
            });
          });
      });
    } else {
      dispatch({
        type: ADD_TO_ACTION_QUEUE,
        payload: ActionQueueTypes.SAVE_NEW_LHS_LATER,
        data: sessionInfo
      });
    }
  };
};

export const saveLHSSessionLater = ({ sessionInfo }) => {
  return dispatch => {
    API.LHSSaveSessionURL.then(url =>
      request(url, JSON.stringify(sessionInfo))
        .then(res => {})
        .catch(err => {
          console.log("error save later", err);
          dispatch({ type: SERVER_STATE, isServerOnline: false });
          dispatch({
            type: ADD_TO_ACTION_QUEUE,
            payload: ActionQueueTypes.SAVE_NEW_LHS_LATER,
            data: sessionInfo
          });
        })
    );
  };
};

export const deleteLHSSession = ({ sessionId }) => {
  return (dispatch, getState) => {
    //We first delete it locally
    dispatch({ type: DELETE_LHS_SESSION, sessionId: sessionId });
    if (isOnline()) {
      API.LHSDeleteSessionURL(sessionId).then(url => {
        request(url, JSON.stringify({ sessionId: sessionId }))
          .then(res => {})
          .catch(err => {
            console.log("error delete now", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
            dispatch({
              type: ADD_TO_ACTION_QUEUE,
              payload: ActionQueueTypes.DELETE_LHS_LATER,
              data: sessionId
            });
          });
      });
    } else {
      dispatch({
        type: ADD_TO_ACTION_QUEUE,
        payload: ActionQueueTypes.DELETE_LHS_LATER,
        data: sessionId
      });
    }
  };
};

export const deleteLHSSessionLater = ({ sessionId }) => {
  return dispatch => {
    API.LHSDeleteSessionURL(sessionId).then(url => {
      request(url, JSON.stringify({ sessionId: sessionId }))
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log("error delete later", err);
          dispatch({ type: SERVER_STATE, isServerOnline: false });
          dispatch({
            type: ADD_TO_ACTION_QUEUE,
            payload: ActionQueueTypes.DELETE_LHS_LATER,
            data: sessionId
          });
        });
    });
  };
};

const parseHides = searchesData => {
  let searches = [];
  Object.keys(searchesData).forEach(location => {
    const s = searchesData[location];
    let subject1 = s.subject1;
    let subject2 = s.subject2;
    let subject3 = s.subject3;


    searches.push({
      location,
      subject1, 
      subject2,
      subject3
    });
  });
  return searches;
};
