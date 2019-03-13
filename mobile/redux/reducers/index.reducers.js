import { combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form';
import UDCReducer from './udc.reducer';
import ConnectionReducer from './connection.reducer';
import LHSReducer from './lhs.reducer';
import GeneralReducer from './general.reducer';
import OBDReducer from './obd.reducer';

const rootReducer = combineReducers({
    form: formReducer,
    udc: UDCReducer,
    lhs: LHSReducer,
    connection: ConnectionReducer,
    general: GeneralReducer,
    obd: OBDReducer,
});

export default rootReducer;