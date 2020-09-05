import { assign } from '../../../youth-employment-success/js/util';

const initialState = {
	region: null
}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function expensesReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_EXPENSES': {
      return assign( {}, state, data.values );
    }
    case 'UPDATE_FROM_URL': {
      if ( data.hasOwnProperty( 'expenses' ) ) {
        return assign( {}, data.expenses );
      }
      return state;
    }
    default:
      return state;
  }
}

export default expensesReducer;