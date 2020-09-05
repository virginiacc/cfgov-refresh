import { FinancialView } from './financial.js';
import actions from '../../actions/actions';

class ExpensesView extends FinancialView {
  constructor () {
    super();
    this.dataProperty = 'expenses';
    this.slice = 'expenses';
    this.regionSelector = '#expenses__region';
    this.region = null;
  }

  addRegionSelectListener() {
    this.regionSelect.addEventListener( 'change', this.handleRegionChange.bind( this ) );
  }

  handleRegionChange() {
    this.region = this.regionSelect.value ;
    this.store.dispatch( actions.updateExpensesByRegion( this.region ) );
  }

  updateRegionSelect( region ) {
    this.regionSelect.value = region;
  }

  onStateUpdate( prevState, state ) {
    super.onStateUpdate( prevState, state );
    const region = state.app.region;
    if ( this.region !== region ) {
      this.updateRegionSelect( region );
      this.region = region;
    }
  }

  init( body, store ) {
    super.init( body, store );
    this.regionSelect = body.querySelector( this.regionSelector );
    this.addRegionSelectListener();
  }
}

export {
  ExpensesView
};