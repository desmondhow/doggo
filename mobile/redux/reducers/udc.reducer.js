import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/sessions/UDCConstants';

export default (state = {}, action) => {
  switch (action.type) {
    case actions.GET_UDC_GENERAL_INITIAL_STATE: {
      return { general: InitialValues.General };
    }
    case actions.GET_UDC_HIDE_INITIAL_STATE: {
      return { hides: InitialValues.Hides };
    }
    case actions.SAVE_NEW_UDC_SESSION: {
      const sessionInfo = action.sessionInfo
      alert(`TODO: setup new session saving\n${JSON.stringify(sessionInfo)}`)
      // TODO: arrange sessionInfo into Object that can be sent to backend and save this session
      // for the user that's logged in (can get userId from auth.js & need to create route on backend for saving a UDC session)
      // Once this is done, such a session can be fetched using another newly created route
      return { hides: InitialValues.Hides };
    }
    default:
      return state;
  }
};