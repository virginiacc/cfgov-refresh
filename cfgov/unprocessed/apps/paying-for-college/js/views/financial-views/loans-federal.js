import { FinancialView } from './financial.js';
import { 
	enforceFederalLoanLimits,
} from '../../helpers/financial-helpers';

class FederalLoansView extends FinancialView {
  constructor() {
    super();
    this.dataProperty = 'federal-loans';
    this.slice = 'federalLoans';
    this.type = 'loans';
  }

  enforceLimits( prop, val ) {
  	return enforceFederalLoanLimits( prop, val, this.store.state );	
  }

  onStateUpdate( prevState, state ) {
  	super.onStateUpdate( prevState, state );
  	if ( prevState.program.programType !== state.program.programType ) {
  		if ( state.program.programType === 'graduate' && 
  			 state.federalLoans.amount_directSub > 0 ) {
  			this.dispatchUpdate( 'amount_directSub', 0 ); 
  		}
  	}
  }
}

export {
  FederalLoansView
};
