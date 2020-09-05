import utils from '../../../../js/organisms/MortgagePerformanceTrends/utils.js';
import AppStore from './store';
import appReducer from '../reducers/app-reducer';
import constantsReducer from '../reducers/constants-reducer';
import costsReducer from '../reducers/costs-reducer';
import expensesReducer from '../reducers/expenses-reducer';
import awardedFundingReducer from '../reducers/awarded-funding-reducer';
import personalFundingReducer from '../reducers/personal-funding-reducer';
import workFundingReducer from '../reducers/work-funding-reducer';
import federalLoansReducer from '../reducers/federal-loans-reducer';
import publicLoansReducer from '../reducers/public-loans-reducer';
import privateLoansReducer from '../reducers/private-loans-reducer';
import plusLoansReducer from '../reducers/plus-loans-reducer';
import navigationReducer from '../reducers/navigation-reducer';
import programReducer from '../reducers/program-reducer';
import schoolReducer from '../reducers/school-reducer';
import schoolProgramReducer from '../reducers/school-program-reducer';
import uiStateReducer from '../reducers/ui-state-reducer';

import { combineReducers } from '../../../youth-employment-success/js/util';

/**
 * Function to create a new store instance
 * @returns {YesStore} an instance of the YesStore class
 */
const CollegeCostsStore = new AppStore(
    combineReducers( {
      app: appReducer,
      constants: constantsReducer,
      costs: costsReducer,
      expenses: expensesReducer,
      awardedFunding: awardedFundingReducer,
      personalFunding: personalFundingReducer,
      workFunding: workFundingReducer,
      federalLoans: federalLoansReducer,
      publicLoans: publicLoansReducer,
      privateLoans: privateLoansReducer,
      plusLoans: plusLoansReducer,
      navigation: navigationReducer,
      program: programReducer,
      school: schoolReducer,
      schoolProgram: schoolProgramReducer,
      uiState: uiStateReducer
    } ),
    [ utils.thunkMiddleware, utils.loggerMiddleware ]
);


export default CollegeCostsStore;