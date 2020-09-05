import { FinancialView } from './financial.js';

class PlusLoansView extends FinancialView {
  constructor() {
    super();
    this.dataProperty = 'plus-loans';
    this.slice = 'plusLoans';
    this.type = 'loans';
  }
      // includeParentPlusBtn = document.querySelector( '#plan__parentPlusFeeRepay' );

  
}

export {
  PlusLoansView
};