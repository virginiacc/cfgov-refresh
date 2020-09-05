import { assign } from '../../../youth-employment-success/js/util';

const initialState = {
  loaded: false,
  subCaps: {
    yearOne: null,
    yearTwo: null,
    yearThree: null
  },
  totalCaps: {
    yearOne: null,
    yearTwo: null,
    yearThree: null
  },
  totalIndepCaps: {
    yearOne: null,
    yearTwo: null,
    yearThree: null
  },
  // processed values
}

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action 
 instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function constantsReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'CONSTANTS_LOADED': {
      return assign( {}, state, { 
        ...data,
        loaded: true
      } )
    }
    default:
      return state;
  }
}

export default constantsReducer;