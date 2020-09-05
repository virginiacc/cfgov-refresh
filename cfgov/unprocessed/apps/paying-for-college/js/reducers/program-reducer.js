import { assign } from '../../../youth-employment-success/js/util';

const initialState = {
  // default to showing the bachelors content
  programType: 'bachelors'
}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function programReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_PROGRAM': {
      // updates one or more of the program values:
      // returns new object
      return assign( {}, state, data );
    }
    case 'UPDATE_FROM_URL': {
      if ( data.hasOwnProperty( 'program' ) ) {
        return assign( {}, data.program );
      }
      return state;
    }
    default:
      return state;
  }
}

export default programReducer;