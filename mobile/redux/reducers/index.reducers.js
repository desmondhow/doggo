import { combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';
import UDCReducer from './udc.reducer';
import ConnectionReducer from './connection.reducer';
export const  RESET_APP = 'RESET_APP';
const rootReducer = combineReducers({
    form: formReducer,
    udc: UDCReducer,
    connection: ConnectionReducer,
});

export default rootReducer;