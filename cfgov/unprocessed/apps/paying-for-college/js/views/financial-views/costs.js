import { FinancialView } from './financial.js';
import actions from '../../actions/actions';
import { hide, show, toggle } from '../../util/other-utils';

class CostsView extends FinancialView {
  constructor () {
    super();
    this.dataProperty = 'costs';
    this.slice = 'costs';
    this.buttonSelector = '.costs_button-section button';
    // this.contentSectionSelector = '#costs_inputs-section';
    // this.buttonSectionSelector = '[data-state-based-visibility="costs-question-hide"]';
    // this.costsQuestionYes = '[data-state-based-visibility="costs-question-yes"]';
    // this.costsQuestionNo = '[data-state-based-visibility="costs-question-no"]'
  }

  addButtonListeners() {
    this.buttons.forEach( elem => {
      elem.addEventListener( 'click', this.handleCostsButtonClick.bind( this ) );
    }, this );
  }

  handleCostsButtonClick( event ) {
    const target = event.target;
    const answer = target.dataset.costs_offerAnswer;
    // When the button is clicked, bring in school data if 'No'
    this.store.dispatch( actions.updateCostsQuestion( answer ) );
    //If their offer does not have costs, use the Department of Ed data
    if ( answer === 'n' ) {
      this.store.dispatch( actions.getFinancialDataFromSchool() );
    }
  }

  handleCostsValueChange( answer ) {
    // hide( this.buttonSection );
    // toggle( this.costsQuestionYes, answer === 'y' );
    // toggle( this.costsQuestionNo, answer === 'n' );
    // show( this.content );
  }

  onStateUpdate( prevState, state ) {
    super.onStateUpdate( prevState, state );
    if ( prevState.app.costsQuestion !== state.app.costsQuestion ) {
      // this.handleCostsValueChange( state.app.costsQuestion );
      actions.updateUIState( {'costsQuestion': state.app.costsQuestion })
    }
  }

  // initContentDisplay() {


  //   hide( this.contentSection );
  //   hide( this.costsQuestionYes );
  //   hide( this.costsQuestionNo );
  // }

  

  // initSelectors( body ) {
  //   this.buttons = body.querySelectorAll( this.buttonSelector );
  //   this.contentSection = body.querySelector( this.contentSectionSelector );
  //   this.buttonSection = body.querySelector( this.buttonSectionSelector );
  //   this.costsQuestionYes = body.querySelector( this.costsQuestionYes );
  //   this.costsQuestionNo = body.querySelector( this.costsQuestionNo );
  // }

  init( body, store ) {
    super.init( body, store );
    // this.initSelectors( body );
    this.buttons = body.querySelectorAll( this.buttonSelector );
    this.addButtonListeners();
    // this.initContentDisplay()
  }
}

export {
  CostsView
};