import actions from '../actions/actions';
import { getTotalContributions } from '../helpers/financial-helpers';
import { calculateTotals } from '../util/other-utils';
import numberToMoney from 'format-usd';

class UncoveredCostsView {
  constructor( body, store ) {
  	this.outputs = body.querySelectorAll('[data-cost-calculations]');
    this.store = store;
    this.store.subscribe( this.onStateUpdate.bind( this ) );
  }

  calculateValues( state ) {
  	const vals = {};
  	const costs = calculateTotals( state.costs );
  	const totals = getTotalContributions( state );
  	vals.contributions = totals.contributions;
  	const diff = costs - vals.contributions;
  	const gap = Math.max( 0, Math.round( diff ) );
  	vals.uncoveredCosts = 0;
  	vals.excessFunding = 0;
  	if ( diff > 0 ) {
  		vals.uncoveredCosts = gap.toString();
  	} else if ( diff < 0 ) {
  		vals.excessFunding = gap.toString();
  	}

  	return vals;
  }

  updateOutputs( data ) {
  	this.outputs.forEach( elem => {
        const prop = elem.dataset.costCalculations;
        elem.innerText = numberToMoney( { amount: data[prop], decimalPlaces: 0 } );
    } )
  }

  handleChange( state ) {
  	const vals = this.calculateValues( state );
  	this.updateOutputs( vals );
  	// update UI state based on excess / uncovered
  }

  onStateUpdate( prevState, state ) {
    const stateSlices = [ 
    	'awardedFunding', 'personalFunding', 'workFunding', 'federalLoans',
    	'plusLoans', 'publicLoans', 'privateLoans', 'costs'
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
}

export {
  UncoveredCostsView
};