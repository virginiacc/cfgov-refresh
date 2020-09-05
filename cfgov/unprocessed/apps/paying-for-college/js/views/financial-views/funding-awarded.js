import { FinancialView } from './financial.js';
import { enforceGrantLimits } from '../../helpers/financial-helpers';

class AwardedFundingView extends FinancialView {
  constructor() {
    super();
    this.dataProperty = 'awarded-funding';
    this.slice = 'awardedFunding';
  }

  enforceLimits( prop, val ) {
    return enforceGrantLimits( prop, val, this.store.state.constants );
  }
}

export {
  AwardedFundingView
};
