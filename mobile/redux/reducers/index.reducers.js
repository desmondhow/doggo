import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form';
import UDCReducer from './udc.reducer';

export default combineReducers({
  form: formReducer,
  udc: UDCReducer
})

