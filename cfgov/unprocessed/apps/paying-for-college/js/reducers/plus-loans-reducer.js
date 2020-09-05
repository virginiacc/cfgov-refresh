import { assign } from '../../../youth-employment-success/js/util';

const initialState = {}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function plusLoansReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_PLUS_LOANS': {
      return assign( {}, state, data );
    }
    case 'UPDATE_FROM_URL': {
      if ( data.hasOwnProperty( 'plusLoans' ) ) {
        return assign( {}, data.plusLoans );
      }
      return state;
    }
    default:
      return state;
  }
}

export default plusLoansReducer;