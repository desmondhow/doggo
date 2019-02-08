import {
    GET_PROFILE,
    RESET_STATE,
} from "../actions/general.actions";


// Initial state
export const initialUDCState = {
    dogs: [],
    handlers:[]
};

export default (state = initialUDCState, action) => {
    switch (action.type) {
        case GET_PROFILE: {
            //Overrides local data with the data obtained from server
            const handlers = action.handlers;
            const dogs = action.dogs;
            return {
                ...state,
                handlers: handlers,
                dogs: dogs
            };

        }
        case RESET_STATE: {
            return {
                ...state,
                handlers: [],
                dogs: []
            };
        }
        default:
            return state;
    }
};