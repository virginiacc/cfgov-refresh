import { assign } from '../../../youth-employment-success/js/util';
const initialState = {}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function uiStateReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_UI': {
      return assign( {}, data );
    }
    default:
      return state;
  }
}

export default uiStateReducer;