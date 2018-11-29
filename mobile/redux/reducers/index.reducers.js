import actions from '../actions/index.actions';
import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form';
import UDCReducer from './udc.reducer';

export default combineReducers({
  // ...your other reducers here
  // you have to pass formReducer under 'form' key,
  // for custom keys look up the docs for 'getFormState'
  form: formReducer,
  udc: UDCReducer
})

