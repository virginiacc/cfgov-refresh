import actions from '../actions/actions';
import { calculateTotals } from '../util/other-utils';
import { calculateDebt } from '../util/debt-calculator.js';
import { getAnnualSalary } from '../helpers/school-helpers';

class DebtView {
  constructor( body, store ) {
  	this.outputs = body.querySelectorAll('[data-debt-calculations]');
    this.store = store;
    this.store.subscribe( this.onStateUpdate.bind( this ) );
  }

  calculateValues( state ) {
  	let vals = calculateDebt( state );
	vals.annual_salary = getAnnualSalary( state ) || 0;
	vals.monthly_salary = vals.annual_salary / 12;
	vals.debtGuideDifference = Math.abs( vals.totalAtGrad - vals.annual_salary );
	vals.debtRuleViolation = ( vals.totalAtGrad > vals.annual_salary ).toString();
	vals.monthly_expenses = calculateTotals( state.expenses ) + vals.tenYearMonthly;
	vals.remainder = vals.monthly_salary - vals.monthly_expenses;
	vals.gap = Math.abs( vals.remainder );
	return vals || {};
  }

  updateOutputs( data ) {
  	this.outputs.forEach( elem => {
        const prop = elem.dataset.debtCalculations;
        elem.innerText = data[prop];
    } );
  }

  handleChange( state ) {
  	const vals = this.calculateValues( state );
  	this.updateOutputs( vals );
  	// update UI state based on excess / uncovered
  }

  onStateUpdate( prevState, state ) {
    const stateSlices = [ 
    	'federalLoans', 'plusLoans', 'publicLoans', 'privateLoans',
    	'expenses', 'program'
    ]
    let changed = false;
    for ( let i = 0; i < stateSlices.length; i++ ) {
    	if ( prevState[stateSlices[i]] !== state[stateSlices[i]] ) {
    		changed = true;
    		break;
    	}
	}
	if ( changed ) {
		this.handleChange( state );
	}
  }
};

export {
  DebtView
};