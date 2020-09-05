import { FinancialView } from './financial.js';
import { getLoanTotals, formatOutput } from '../../helpers/financial-helpers';

class PrivateLoansView extends FinancialView {
  constructor() {
    super();
    this.dataProperty = 'private-loans';
    this.slice = 'privateLoans';
    this.type = 'loans';
  }

  formatVal( prop, val ) {
    const type = prop.split( '_' )[0];
    return formatOutput( val, type );
  }

  formatInput( prop, val ) {
    const type = prop.split( '_' )[0];
    if ( type === 'rate' || type === 'fee' ) {
      return val / 100;
    }
    return val;
  }

}

export {
  PrivateLoansView
};