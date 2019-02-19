import { combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';
import UDCReducer from './udc.reducer';
import ConnectionReducer from './connection.reducer';
import LHSReducer from './lhs.reducer';
const rootReducer = combineReducers({
    form: formReducer,
    udc: UDCReducer,
    lhs: LHSReducer,
    connection: ConnectionReducer,
});

export default rootReducer;