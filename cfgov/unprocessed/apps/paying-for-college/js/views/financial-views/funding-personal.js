import { FinancialView } from './financial.js';

class PersonalFundingView extends FinancialView {
  constructor () {
    super();
    this.dataProperty = 'personal-funding';
    this.slice = 'personalFunding';
  }
}

export {
  PersonalFundingView
};
