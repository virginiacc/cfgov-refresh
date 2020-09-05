import { fetchConstantsData, fetchExpensesData, fetchSchoolData } from '../util/api';
import { getCostsFromSchool, getProgramData } from '../helpers/school-helpers';
import { processConstantsData } from '../helpers/constants-helpers';
import { getExpensesByRegion } from '../helpers/expenses-helpers';

import { assign } from '../../../youth-employment-success/js/util';

const FINANCIAL_MAP = {
  'costs': 'UPDATE_COSTS',
  'expenses': 'UPDATE_EXPENSES',
  'awardedFunding': 'UPDATE_AWARDED_FUNDING',
  'personalFunding': 'UPDATE_PERSONAL_FUNDING',
  'workFunding': 'UPDATE_WORK_FUNDING',
  'federalLoans': 'UPDATE_FEDERAL_LOANS',
  'privateLoans': 'UPDATE_PRIVATE_LOANS',
  'publicLoans': 'UPDATE_PUBLIC_LOANS',
  'plusLoans': 'UPDATE_PLUS_LOANS'
}

const actions = {
  appStarted: data => ( {
    type: 'APP_STARTED',
    data: data
  } ),

  constantsLoaded: data => ( {
    type: 'CONSTANTS_LOADED',
    data: data
  } ),

  expensesLoaded: data => ( {
    type: 'EXPENSES_LOADED',
    data: data
  } ),

  updateUIState: data => ( {
    type: 'UPDATE_UI',
    data: data
  } ),

  updateSection: section => ( {
    type: 'UPDATE_SECTION',
    data: section
  } ),

  updateExpenses: data => ( {
    type: 'UPDATE_EXPENSES',
    data: data
  } ),

  updateCosts: data => ( {
    type: 'UPDATE_COSTS',
    data: data
  } ),

  updateFinancialValue: ( prop, value, type )  => ( {
    type: FINANCIAL_MAP[type],
    data: {[prop]: value}
  } ),

  updateSchool: ( school ) => ( {
    type: 'UPDATE_SCHOOL',
    data: school
  } ),

  updateSelectedProgram: ( data ) => ( {
    type: 'UPDATE_SELECTED_PROGRAM',
    data: data
  } ),

  clearProgram: ( data ) => ( {
    type: 'CLEAR_PROGRAM',
    data: data
  } ),

  updateProgram: ( data ) => ( {
    type: 'UPDATE_PROGRAM',
    data: data
  } ),

  updateCostsQuestion: ( answer ) => ({
    type: 'UPDATE_COSTS_QUESTION',
    data: { 'costsQuestion': answer }
  }),

  updateApp: ( data ) => ({
    type: 'UPDATE_APP',
    data: data
  }),

  updateFromURL: ( data ) => ({
    type: 'UPDATE_FROM_URL',
    data: data
  }),

  updateUIState: ( prop, value ) => ({
    type: 'UPDATE_UI_STATE',
    data: { [prop]: value }
  }),

  fetchInitialData: ( urlData ) => dispatch => {
    if ( urlData.school ) {
      let schoolProgram = null;
      if ( urlData.hasOwnProperty('schoolProgram') && 
           urlData.hasOwnProperty( 'program' ) && 
           urlData.program.programType === 'graduate' ) {
        schoolProgram = urlData.schoolProgram;
      }
      dispatch( actions.fetchSchool( urlData.school.schoolID, schoolProgram ) );     
    }
    const hasExpenses = urlData.hasOwnProperty( 'expenses' );
    dispatch( actions.fetchExpenses( hasExpenses ) );
    dispatch( actions.fetchConstants() );
    dispatch( actions.updateFromURL( urlData ) );
  },

  fetchConstants: () => dispatch => {
    return fetchConstantsData( data => {
      const values = processConstantsData( data );
      dispatch( actions.constantsLoaded( values ));
    } );
  },

  fetchExpenses: ( expensesInURL ) => ( dispatch, getStore ) => {
    return fetchExpensesData( data => {
      dispatch( actions.expensesLoaded( data ));
      const store = getStore();
      if ( !expensesInURL ) {
        dispatch( actions.updateExpensesByRegion( 'NE' ) );
      }
    } );
  },

  fetchSchool: ( iped, schoolProgram ) => ( dispatch, getStore ) => {
    return fetchSchoolData ( iped, schoolData => {
      dispatch( actions.updateSchool( schoolData ) );
      if ( schoolProgram && schoolData.hasOwnProperty( 'programCodes' ) ) {
        let programData = getProgramData( 
          schoolData.programCodes.graduate,
          schoolProgram.pid 
        );
        if ( programData ) {
          dispatch( actions.updateSelectedProgram( programData ) );
        }
      }
    } );
  },

  updateExpensesByRegion: ( region ) => ( dispatch, getStore ) => {
    const values = getExpensesByRegion( region, getStore() );
    const data = { values, region };
    dispatch( actions.updateExpenses( data ) );
  },

  getFinancialDataFromSchool: () => ( dispatch, getStore ) => {
    const values = getCostsFromSchool( getStore() );
    dispatch( actions.updateCosts( values ) );
  }
} 

export default actions;