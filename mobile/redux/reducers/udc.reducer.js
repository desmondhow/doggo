import Constants from "../../constants/Api";
import {
    SAVE_UDC_SESSION,
    DELETE_UDC_SESSION,
    GET_ALL_UDC,
    RESET_STATE,
    UPDATE_UDC_SESSION
} from "../actions/udc.actions";


// Initial state
export const initialUDCState = {
    currSessionsData: [],
};

export default (state = initialUDCState, action) => {
    switch (action.type) {

        case UPDATE_UDC_SESSION: {
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
                        hides: sessionInfo.hides
                    } :
                    // otherwise return original
                    session

                )
            };

        }

        case DELETE_UDC_SESSION: {
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

        case SAVE_UDC_SESSION: {
            const sessionInfo = action.sessionInfo;
            return {
                ...state,
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
        // case SAVE_UDC_DOG_TRAINING: {
        //     const performanceInfo = action.performanceInfo;
        //     // console.log(`performanceInfo: ${performanceInfo}`);
        //     // api call or whatever to actually save the perfomanceInfo for the dog to the state
        //     // note performanceInfo.dogs is what we want!
        //     return state;
        // }

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