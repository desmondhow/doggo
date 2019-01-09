import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/sessions/UDCConstants';
import Constants from "../../constants/Api";

export default (state = {}, action) => {
  switch (action.type) {
    case actions.GET_UDC_GENERAL_INITIAL_STATE: {
      return { general: InitialValues.General };
    }
    case actions.GET_UDC_HIDES_INITIAL_STATE: {
      return { hides: InitialValues.Hides };
    }
      case actions.SAVE_NEW_UDC_SESSION: {
      const sessionInfo = action.sessionInfo;

      Constants.getSaveUDCSessionURL()
      .then(url => (
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sessionInfo)
        })
      ))
      .then(res => res.json())
      .then((res) => {
        console.log(`New UDC Session Id: ${res}`)
        console.log('this isnt reached because User.findById on server doesnt work')
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
      // return { hides: InitialValues.Hides };
    }

    default:
      return state;
  }
};