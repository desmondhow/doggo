import {
    GET_PROFILE,
    RESET_STATE,
} from "../actions/general.actions";


// Initial state
export const initialUDCState = {
    dogs: [],
    trainers:[]
};

export default (state = initialUDCState, action) => {
    switch (action.type) {
        case GET_PROFILE: {
            //Overrides local data with the data obtained from server
            const trainers = action.trainers;
            const dogs = action.dogs;
            return {
                ...state,
                trainers: trainers,
                dogs: dogs
            };

        }
        case RESET_STATE: {
            return {
                ...state,
                trainers: [],
                dogs: []
            };
        }
        default:
            return state;
    }
};