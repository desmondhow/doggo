import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/SessionsConstants';
import Constants from "../../constants/Api";

export default (state = {}, action) => {
  switch (action.type) {
    // case actions.GET_UDC_NEW_SESSION_INITIAL_STATE: {
    //   return { initial: InitialValues.General };
    // }
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
    case actions.SAVE_UDC_SESSION: {
      const sessionInfo = action.sessionInfo      
      Constants.saveUDCSessionURL
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
      .catch(err => {
        console.error(err);
        throw err;
      })
      return { hides: InitialValues.Hides };
    }
    case actions.EDIT_NEW_UDC_SESSION: {
      const sessionInfo = action.sessionInfo
    }
    default:
      return state;
  }
};