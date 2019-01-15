import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/SessionsConstants';
import Constants from "../../constants/Api";

export default (state = {}, action) => {
  switch (action.type) {
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
    case actions.DELETE_UDC_SESSION: {
      const sessionId = action.sessionId
      Constants.deleteUDCSessionURL(sessionId)
      .then(url => (   
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: sessionId })
        })
      ))
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