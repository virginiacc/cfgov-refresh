import { assign } from '../../../youth-employment-success/js/util';

const initialState = {
    activeSection: null
}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function navigationReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_SECTION': {
      return { activeSection: data };
    }
    default:
      return state;
  }
}

export default navigationReducer;