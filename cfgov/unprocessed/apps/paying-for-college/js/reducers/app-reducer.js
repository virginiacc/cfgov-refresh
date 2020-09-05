import { assign } from '../../../youth-employment-success/js/util';

const initialState = {
    started: false,
    costsQuestion: null,
    expensesLoaded: false,
    rawExpenses: {},
    oid: null,
    utm_source: null,
  	utm_medium: null,
  	utm_campaign: null,
  	impactOffer: null,
  	impactLoans: null
}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function appReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'APP_STARTED': {
      return assign( state, { started: true } )
    }
    case 'EXPENSES_LOADED': {
      return assign( {}, state, { rawExpenses: data, expensesLoaded: true } )
    }
    case 'UPDATE_EXPENSES': {
      return assign( {}, state, { region: data.region } )
    }
    case 'UPDATE_COSTS_QUESTION': {
      return assign( {}, state, {costsQuestion: data} );
    }
    case 'UPDATE_APP': {
      return assign( {}, state, data );
    }
    case 'UPDATE_FROM_URL': {
      if ( data.hasOwnProperty( 'app' ) ) {
        return assign( {}, data.app );
      }
      return state;
    }
    default:
      return state;
  }
}

export default appReducer;

