import Constants from "../../constants/Api";
import {
    SAVE_LHS_SESSION,
    DELETE_LHS_SESSION,
    SAVE_LHS_DOG,
    SAVE_LHS_DOG_TRAINING,
    GET_ALL_LHS,
    RESET_STATE, UPDATE_LHS_SESSION
} from "../actions/lhs.actions";


// Initial state
export const initialLHSState = {
    currSessionsData: [],
};

export default (state = initialLHSState, action) => {
    switch (action.type) {

        case UPDATE_LHS_SESSION: {
            const sessionInfo = action.sessionInfo;
            const sessionId = sessionInfo.sessionId;
            //Update element
            return {
                ...state,
                currSessionsData: state.currSessionsData.map(session => session.sessionId === sessionId ?
                    // transform the one with a matching id
                    {...session,
                        temperature: sessionInfo.temperature,
                        humidity: sessionInfo.humidity,
                        wind: sessionInfo.wind,
                        windDirection: sessionInfo.windDirection,
                        complete: sessionInfo.complete,
                        searches: sessionInfo.searches
                    } :
                    // otherwise return original
                    session

                )
            };

        }

        case DELETE_LHS_SESSION: {
            const sessionId = action.sessionId;
            // Find index where session to be deleted is located.
            let i =0;

            for (i; i < state.currSessionsData.length; i++ ) {
                if (state.currSessionsData[i].sessionId === sessionId) {
                    break;
                }
            }
            return {
                ...state,
                currSessionsData: [
                    ...state.currSessionsData.filter((item, index) => index !== i)
                ]
            };

        }

        case SAVE_LHS_SESSION: {
            const sessionInfo = action.sessionInfo;
            return {
                ...state,
                //Push new session
                currSessionsData: [...state.currSessionsData, sessionInfo]
            };
        }

        case GET_ALL_LHS: {
            //Overrides local data with the data obtained from server
            const sessions = action.sessions;
            return {
                ...state,
                currSessionsData: sessions,
            };

        }
        case SAVE_LHS_DOG: {
            return { ...state, dog: action.dog };
        }
        case SAVE_LHS_DOG_TRAINING: {
            const performanceInfo = action.performanceInfo;
            // console.log(`performanceInfo: ${performanceInfo}`);
            // api call or whatever to actually save the perfomanceInfo for the dog to the state
            // note performanceInfo.dogs is what we want!
            return state;
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