import { FinancialView } from './financial.js';
import { getLoanTotals, formatOutput } from '../../helpers/financial-helpers';
import { stringToNum } from '../../util/number-utils';

class PublicLoansView extends FinancialView {
  constructor() {
    super();
    this.dataProperty = 'public-loans';
    this.slice = 'publicLoans';
    this.type = 'loans';
  }

  formatVal( prop, val ) {
    const type = prop.split( '_' )[0];
    return formatOutput( val, type );
  }

  formatInput( prop, val ) {
    const type = prop.split( '_' )[0];
    val = stringToNum( val );
    if ( type === 'rate' || type === 'fee' ) {
      return val / 100;
    }
    return val;
  }
}

export {
  PublicLoansView
};
