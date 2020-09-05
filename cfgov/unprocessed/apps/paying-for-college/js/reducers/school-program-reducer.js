import { assign } from '../../../youth-employment-success/js/util';
const defaultValues = {
    pid: null,
    programName: null,
    salary: null
};

const initialState = assign( {}, defaultValues );

/**
 *
 * @param {object} state the current values for this slice of app state
 * @param {object} action instructs reducer which state update to apply
 * @returns {object} the updated state object
 */
function schoolProgramReducer( state = initialState, action ) {
  const { type, data } = action;

  switch ( type ) {
    case 'UPDATE_SELECTED_PROGRAM': {
      // updates pid. programName, and salary
      // returns new state object
      return assign( {}, data );
    }
    case 'CLEAR_PROGRAM': {
      // updates one of the program values:
      // returns new object
      return assign( {}, defaultValues );
    }
    default:
      return state;
  }
}

export default schoolProgramReducer;