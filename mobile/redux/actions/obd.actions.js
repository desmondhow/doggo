// export const GET_OBD_NEW_SESSION_INITIAL_STATE = 'GET_OBD_NEW_SESSION_INITIAL_STATE';
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
export const SAVE_OBD_SESSION = "SAVE_OBD_SESSION";
export const GET_ALL_OBD = "GET_ALL_OBD";
export const DELETE_OBD_SESSION = "DELETE_OBD_SESSION";
export const UPDATE_OBD_SESSION = "UPDATE_OBD_SESSION";
export const RESET_STATE = "RESET_STATE";

export const SAVE_OBD_DOG = "SAVE_OBD_DOG";
export const SAVE_OBD_DOG_TRAINING = "SAVE_OBD_DOG_TRAINING";

/**
 * Action Creators
 */
export const getAllOBD = () => {
  console.log("Getting all obd sessions");
  return (dispatch, getState) => {
    if (isOnline(getState)) {
      API.OBDCurrentSessionsURL.then(url => {
        request(url, null, "GET")
          .then(res => res.json())
          .then(res => {
            let sessionData = [];
            res.sessions.map((key, i) => {
              sessionData.push(key.data);
            });
            dispatch({ type: GET_ALL_OBD, sessions: sessionData });
          })
          .catch(err => {
            console.log("error get all obd", err);
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
 * Saves a OBD session. If there is no connection, session is saved locally and pushed to db once there is connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveOBDSession = ({ sessionInfo }) => {
  return (dispatch, getState) => {
    //Transform session info
      console.log('Data that is being saved', sessionInfo);
      //Todo: implement custom method to parse the data, in the meantime it will be just an obj
    // sessionInfo.searches = parseSearches(sessionInfo.searches);
    //We save it locally first
    if (!sessionInfo.isNew) {
      console.log("Updating session");
      dispatch({ type: UPDATE_OBD_SESSION, sessionInfo: sessionInfo });
    } else {
      console.log("Creating new session");
      dispatch({ type: SAVE_OBD_SESSION, sessionInfo: sessionInfo });
    }
    if (isOnline(getState)) {
      API.OBDSaveSessionURL.then(url => {
        console.log(url);
        console.log(`sessionInfo: ${JSON.stringify(sessionInfo)}`);
        request(url, JSON.stringify(sessionInfo))
          .then(res => {})
          .catch(err => {
            console.log("error save now", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
            dispatch({
              type: ADD_TO_ACTION_QUEUE,
              payload: ActionQueueTypes.SAVE_NEW_OBD_LATER,
              data: sessionInfo
            });
          });
      });
    } else {
      console.log("adding 2 quere");
      dispatch({
        type: ADD_TO_ACTION_QUEUE,
        payload: ActionQueueTypes.SAVE_NEW_OBD_LATER,
        data: sessionInfo
      });
    }
  };
};

export const saveOBDSessionLater = ({ sessionInfo }) => {
  return dispatch => {
    API.OBDSaveSessionURL.then(url =>
      request(url, JSON.stringify(sessionInfo))
        .then(res => {})
        .catch(err => {
          console.log("error save later", err);
          dispatch({ type: SERVER_STATE, isServerOnline: false });
          dispatch({
            type: ADD_TO_ACTION_QUEUE,
            payload: ActionQueueTypes.SAVE_NEW_OBD_LATER,
            data: sessionInfo
          });
        })
    );
  };
};

export const deleteOBDSession = ({ sessionId }) => {
  return (dispatch, getState) => {
    //We first delete it locally
    dispatch({ type: DELETE_OBD_SESSION, sessionId: sessionId });
    if (isOnline(getState)) {
      API.OBDDeleteSessionURL(sessionId).then(url => {
        request(url, JSON.stringify({ sessionId: sessionId }))
          .then(res => {})
          .catch(err => {
            console.log("error delete now", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
            dispatch({
              type: ADD_TO_ACTION_QUEUE,
              payload: ActionQueueTypes.DELETE_OBD_LATER,
              data: sessionId
            });
          });
      });
    } else {
      dispatch({
        type: ADD_TO_ACTION_QUEUE,
        payload: ActionQueueTypes.DELETE_OBD_LATER,
        data: sessionId
      });
    }
  };
};

export const deleteOBDSessionLater = ({ sessionId }) => {
  return dispatch => {
    API.OBDDeleteSessionURL(sessionId).then(url => {
      request(url, JSON.stringify({ sessionId: sessionId }))
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log("error delete later", err);
          dispatch({ type: SERVER_STATE, isServerOnline: false });
          dispatch({
            type: ADD_TO_ACTION_QUEUE,
            payload: ActionQueueTypes.DELETE_OBD_LATER,
            data: sessionId
          });
        });
    });
  };
};

/**
 * Saves a OBD Training session. If there is no connection, session is saved locally and pushed to db once there is
 * connection.
 * @param sessionInfo
 * @returns {Function}
 */
export const saveOBDTraining = ({ sessionInfo, handlers }) => {
  return (dispatch, getState) => {
    console.log(`SESSIONINFO: ${JSON.stringify(sessionInfo)}\n\n`);
    sessionInfo.dogsTrained = parseTrainingData(
      sessionInfo.dogsTrained,
      handlers
    );
    console.log("session info after edit", sessionInfo);
    //We save it locally first
    dispatch({ type: UPDATE_OBD_SESSION, sessionInfo: sessionInfo });
    if (isOnline(getState)) {
      API.OBDTrainURL.then(url => {
        console.log(url);
        request(
          url,
          JSON.stringify({
            sessionId: sessionInfo.sessionId,
            sessionInfo: sessionInfo.dogsTrained
          }),
          "POST"
        )
          .then(res => {})
          .catch(err => {
            console.log("error train now", err);
            dispatch({ type: SERVER_STATE, isServerOnline: false });
            dispatch({
              type: ADD_TO_ACTION_QUEUE,
              payload: ActionQueueTypes.SAVE_OBD_TRAINING_LATER,
              data: sessionInfo
            });
          });
      }).catch(err => {});
    } else {
      dispatch({
        type: ADD_TO_ACTION_QUEUE,
        payload: ActionQueueTypes.SAVE_OBD_TRAINING_LATER,
        data: sessionInfo
      });
    }
  };
};

export const saveOBDTrainingLater = ({ sessionInfo }) => {
  return dispatch => {
    API.OBDTrainURL.then(url =>
      request(
        url,
        JSON.stringify({
          sessionId: sessionInfo.sessionId,
          sessionInfo: sessionInfo.dogsTrained
        }),
        "POST"
      )
        .then(res => {})
        .catch(err => {
          console.log("error save training later", err);
          dispatch({ type: SERVER_STATE, isServerOnline: false });
          dispatch({
            type: ADD_TO_ACTION_QUEUE,
            payload: ActionQueueTypes.SAVE_OBD_TRAINING_LATER,
            data: sessionInfo
          });
        })
    );
  };
};

const PLACEMENTS = {
  "Prop Off Rubble": "offRubble",
  "Prop Edge of Rubble": "edgeRubble",
  "Prop On Rubble": "onRubble",
  Diffused: "diffused",
  "In Vehicle": "inVehicle",
  "In Room": "inRoom",
  Concealed: "concealed",
  Visible: "visible",
  "High/Ceiling": "highCeiling",
  Props: "props",
  "In Rubble Hole": "inRubbleHole",
  Below: "below",
  "Distance 3-6ft": "distanceLow",
  "Distance >7ft": "distanceHigh"
};


const parseSearches = searchesData => {
  let searches = [];
  console.log(searchesData);
  Object.keys(searchesData).forEach(searchNumber => {
    let location = searchesData[searchNumber].location;
    let placements = {};
    searchesData[searchNumber].placements.forEach(placement => {
      console.log(`searchesData: ${searchesData}`);
      placement = PLACEMENTS[placement];
      placements[placement] = true;
    });
    let notes = searchesData[searchNumber].notes;

    searches.push({
      searchNumber,
      location,
      placements,
      notes
    });
  });
  console.log(`searches: ${JSON.stringify(searches)}`);
  return searches;
};

const parseTrainingData = (trainingData, handlers) => {
  Object.keys(trainingData).forEach(dogId => {
    const searchInfo = trainingData[dogId];
    if (!!searchInfo["handler"]) {
      const handler = handlers.find(
        handler => handler.name === searchInfo["handler"]
      );
      searchInfo["handlerId"] = handler._id;
    }

    Object.keys(searchInfo["performance"]).forEach(searchId => {
      const performanceInfo = searchInfo["performance"][searchId];
      Object.keys(performanceInfo).forEach(field => {
        if (field === "fields") {
          performanceInfo[field].forEach(f => {
            f = f[0].toLowerCase() + f.replace(" ", "").substr(1);
            console.log(f);
            searchInfo["performance"][searchId][f] = true;
          });
          delete performanceInfo[field];
        } else if (field === "duration") {
          searchInfo["performance"][searchId]["duration"] = `${field.minutes}:${
            field.seconds
          }`;
        } else if (typeof performanceInfo[field] === "object") {
          if (!!performanceInfo[field]["text"]) {
            searchInfo["performance"][searchId][field] =
              performanceInfo[field]["text"];
          }
        }

      });
    });
  });

  return trainingData;
};
