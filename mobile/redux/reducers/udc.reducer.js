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
    default:
      return state;
  }
};