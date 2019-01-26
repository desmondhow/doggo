import {InitialValues} from '../../constants/SessionsConstants';
import Constants from "../../constants/Api";
import {
    ADD_NEW_UDC_SESSION_HIDE,
    DELETE_UDC_SESSION, GET_ALL_UDC,
    SAVE_UDC_SESSION,
    UPDATE_NEW_UDC_SESSION_HIDE,
    RESET_STATE
} from "../actions/udc.actions";


// Initial state
export const initiaUDCState = {
    currSessionsData: [],
};

export default (state = initiaUDCState, action) => {
    switch (action.type) {
        case UPDATE_NEW_UDC_SESSION_HIDE: {
            const {concentration, size, property, value} = actions.hideInfo
            return {
                ...state,
                addedHides: {
                    [concentration]: {
                        [size]: {
                            [property]: value
                        }
                    }
                }
            }
        }
        case ADD_NEW_UDC_SESSION_HIDE: {
            const {
                concentration,
                size,
                location,
                isConcealed,
                placementArea,
                placementHeight
            } = actions.hideInfo;
            return {
                ...state,
                addedHides: {
                    [concentration]: {
                        [size]: {
                            location: location,
                            isConcealed: isConcealed,
                            placementArea: placementArea,
                            placementHeight: placementHeight
                        }
                    }
                }
            }
        }
        case DELETE_UDC_SESSION: {
            const sessionId = action.sessionId;
            Constants.deleteUDCSessionURL(sessionId)
                .then(url => (
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({sessionId: sessionId})
                    })
                ))
                .catch(err => {
                    console.error(err);
                    throw err;
                });
            return {
                ...state,
                hides: InitialValues.Hides
            };
        }


        case SAVE_UDC_SESSION: {
            const sessionInfo = action.sessionInfo;
            console.log('hides data', sessionInfo.hides);
            return {
                ...state,
                //Reset previous hides state
                hides: InitialValues.Hides,
                //Push new session
                currSessionsData: [...state.currSessionsData, sessionInfo]
            };
        }
        case GET_ALL_UDC: {
            //Overrides local data with the data obtained from server
            const sessions = action.sessions;
            return {
                ...state,
                currSessionsData: sessions,
            };

        }
        case RESET_STATE: {
            return {
                ...state,
                currSessionsData: []
            };
        }
        default:
            return state;
    }
};