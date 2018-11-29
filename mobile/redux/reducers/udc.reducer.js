import * as actions from '../actions/index.actions';
import { InitialValues } from '../../constants/sessions/UDC';

export default (state = {}, action) => {
  switch (action.type) {
    case actions.GET_UDC_GENERAL_INITIAL_STATE: {
      return { data: InitialValues };
    }
    case actions.SAVE_UDC_GENERAL_STATE: {
      return { filledData: action.data}
    }
    default:
      return state;
  }
};