import * as actions from '../actions/index.actions';

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
    case actions.SAVE_UDC_DOG: {
      return { dog: action.dog };
    }
    case actions.SAVE_UDC_DOG_TRAINING: {
      const performanceInfo = action.performanceInfo;
      // console.log(`performanceInfo: ${performanceInfo}`);
      // api call or whatever to actually save the perfomanceInfo for the dog to the state
      // note performanceInfo.dogs is what we want!
      return state;
    }
    default:
      return state;
  }
};