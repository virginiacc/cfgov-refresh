// This file controls the college costs application
import Expandable from '@cfpb/cfpb-expandables/src/Expandable';
import CollegeCostsStore from './stores/college-costs-store';
import { appView } from './views/app.js';
import { navigationView } from './views/navigation-view.js';
import { schoolView } from './views/school.js';
import { schoolProgramView } from './views/school-program-view.js';
import { programView } from './views/program-view.js';
import { constantsView } from './views/constants-view.js';
import { CostsView } from './views/financial-views/costs.js';
import { AwardedFundingView } from './views/financial-views/funding-awarded.js';
import { PersonalFundingView } from './views/financial-views/funding-personal.js';
import { WorkFundingView } from './views/financial-views/funding-work.js';
import { PrivateLoansView } from './views/financial-views/loans-private.js';
import { FederalLoansView } from './views/financial-views/loans-federal.js';
import { PublicLoansView } from './views/financial-views/loans-public.js';
import { PlusLoansView } from './views/financial-views/loans-plus.js';
import { UncoveredCostsView } from './views/costs-uncovered.js';
import { DebtView } from './views/debt.js';
import { ExpensesView } from './views/financial-views/expenses.js';
import { meterChartView } from './views/meter-chart-view.js';
import { chartView } from './views/chart.js';

/**
 * Initialize the app
 */
const init = function() {
  const body = document.querySelector( 'body' );

  navigationView.init( body, CollegeCostsStore );
  schoolView.init( body, CollegeCostsStore );
  schoolProgramView.init( body, CollegeCostsStore );
  programView.init( body, CollegeCostsStore );
  constantsView.init( body, CollegeCostsStore );
  const debtView = new DebtView( body, CollegeCostsStore );
  const uncoveredCostsView = new UncoveredCostsView( body, CollegeCostsStore );
  const expenses = new ExpensesView();
  expenses.init( body, CollegeCostsStore );
  const costs = new CostsView();
  costs.init( body, CollegeCostsStore );
  const awarded = new AwardedFundingView();
  awarded.init( body, CollegeCostsStore );
  const personalView = new PersonalFundingView();
  personalView.init( body, CollegeCostsStore );
  const workView = new WorkFundingView();
  workView.init( body, CollegeCostsStore );
  const privateView = new PrivateLoansView();
  privateView.init( body, CollegeCostsStore );
  const publicView = new PublicLoansView();
  publicView.init( body, CollegeCostsStore );
  const federalView = new FederalLoansView();
  federalView.init( body, CollegeCostsStore );
  const plusView = new PlusLoansView();
  plusView.init( body, CollegeCostsStore );
  meterChartView.init( body, CollegeCostsStore );
  chartView.init( body, CollegeCostsStore )
  appView.init( body, CollegeCostsStore );


  Expandable.init();
};

window.addEventListener( 'load', init );
