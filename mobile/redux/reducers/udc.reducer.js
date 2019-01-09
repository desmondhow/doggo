import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/sessions/UDCConstants';
import Constants from "../../constants/Api";

export default (state = {}, action) => {
  switch (action.type) {
    case actions.GET_UDC_GENERAL_INITIAL_STATE: {
      return { initial: InitialValues.General };
    }
    case actions.GET_UDC_HIDES_INITIAL_STATE: {
      return { addedHides: {} };
    }
    case actions.UPDATE_NEW_UDC_SESSION_HIDE: {
      const { concentration, size, property, value } = actions.hideInfo
      return {
        addedHides: {
          [concentration]: {
            [size]: {
              [property]: value
            }
          }
        }
      }
    }
    case actions.ADD_NEW_UDC_SESSION_HIDE: {
      const { 
        concentration, 
        size, 
        location, 
        isConcealed, 
        placementArea, 
        placementHeight 
      } = actions.hideInfo
      return {
        addedHides: {
          [concentration]: {
            [size]: {
              location: location,
              isConcealed: isConcealed,
              placementArea: placementArea,
              placementHeight: placementHeight
            }
          }
        }
      }
    }
    case actions.SAVE_NEW_UDC_SESSION: {
      const sessionInfo = action.sessionInfo
      console.log(`sessionInfo: ${JSON.stringify(sessionInfo)}`)
      
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
        console.log(`New UDC Session Id: ${JSON.stringify(res)}`)
      })
      .catch(err => {
        console.error(err);
        throw err;
      })
      return { hides: InitialValues.Hides };
    }
    default:
      return state;
  }
};