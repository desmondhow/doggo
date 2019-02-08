import { combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';
import UDCReducer from './udc.reducer';
import ConnectionReducer from './connection.reducer';
import GeneralReducer from './general.reducer';

const rootReducer = combineReducers({
    form: formReducer,
    udc: UDCReducer,
    connection: ConnectionReducer,
    general: GeneralReducer,
});

export default rootReducer;