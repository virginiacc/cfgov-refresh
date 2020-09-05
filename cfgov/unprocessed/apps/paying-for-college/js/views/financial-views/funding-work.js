import { FinancialView } from './financial.js';

class WorkFundingView extends FinancialView {
  constructor () {
    super();
    this.dataProperty = 'work-funding';
    this.slice = 'workFunding';
  }

  onStateUpdate( prevState, state ) {
    super.onStateUpdate( prevState, state );
    if ( prevState.program.programType !== state.program.programType &&
         state.program.programType !== 'graduate' ) {
      if ( state.workFunding['assistantship_fellow-or-assistantship'] > 0 ) {
        this.dispatchUpdate( 'assistantship_fellow-or-assistantship', 0 );
      }
      if ( state.workFunding['fellowship_fellow-or-assistantship'] > 0 ) {
        this.dispatchUpdate( 'fellowship_fellow-or-assistantship', 0 );
      } 
    }
  }
}

export {
  WorkFundingView
};
