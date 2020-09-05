import numberToMoney from 'format-usd';
import { bindEvent } from '../../../../../js/modules/util/dom-events';
import actions from '../../actions/actions';
import { getLoanTotals, sanitizeOutput } from '../../helpers/financial-helpers';
import { stringToNum } from '../../util/number-utils';
import { calculateTotals, calculateSubtotals, camelCase } from '../../util/other-utils';


class FinancialView {
  constructor() {
    this.inputChangeTimeout = null;
  	this.currentInput = null;
  	this.dataProperty = null;
  	this.slice = null;
  }

  addInputListeners() {
  	this.inputs.forEach( elem => {
  		elem.addEventListener( 'keyup', this.handleInputChange.bind( this ) );
  		elem.addEventListener( 'focusout', this.handleInputChange.bind( this ) );
  		elem.addEventListener( 'click', this.handleInputClick.bind( this ) );
    }, this );
  }

  handleInputChange( event ) {
    clearTimeout( this.inputChangeTimeout );
    const elem = event.target;
    const prop = elem.dataset[this.dataSetAttribute];
    let value = stringToNum( elem.value );
    this.currentInput = elem;
    if ( elem.matches( ':focus' ) ) {
    	this.inputChangeTimeout = setTimeout(() => { 
    		this.dispatchUpdate( prop, value );
    	}, 500);
    } else {
      this.dispatchUpdate( prop, value );
    }
  }

  dispatchUpdate( prop, value ) {
    let val = value;
    if ( this.enforceLimits ) {
      const correctedVal = this.enforceLimits( prop, val, this.store.state );
      val = correctedVal === false ? val : correctedVal;
    }
    if ( this.formatInput ) {
      val = this.formatInput( prop, val )
    }
    this.store.dispatch( actions.updateFinancialValue( prop, val, this.slice ) );
  }

  handleInputClick( event ) {
    const target = event.target;
    // TODO: update with more sanitizing of dollar signs
    if ( target.value === '$0' ) {
      target.value = '';
    }
  }

  formatVal( prop, val ) {
    return numberToMoney( { amount: val, decimalPlaces: 0 } );
  }

  updateElement( elem, val ) {
    if ( elem.tagName === 'INPUT' ) {
      elem.value = val;
    } else {
      elem.innerText = val;
    }
  }

  updateElements( data ) {
    this.elements.forEach( elem => {
      
      if ( !elem.matches( ':focus' ) ) {
        const prop = elem.dataset[this.dataSetAttribute];
        let val = data[prop];
        val = sanitizeOutput( val );
        val = this.formatVal( prop, val );

        if (this.slice === 'expenses') {
      }

        this.updateElement( elem, val );
      }
    }, this );
  }

  getTotals( vals, state ) {
    if ( this.type === 'loans' ) {
      return getLoanTotals( state, this.slice );
    }
    else {
      let total = calculateTotals( vals );
      let subtotals = calculateSubtotals( vals );
      return {total, ...subtotals};
    }
  }

  updateUI( state ) {
    const vals = state[this.slice];
    const data = { ...vals, ...this.getTotals( vals, state ) };
    this.updateElements( data );
    if ( this.updateUIState ) {
      this.updateUIState( data, state );
    }
  }

  /**
   * 
   * @param {object} prevState The last state of the app.
   * @param {object} state The current state of the app.
   */
   onStateUpdate( prevState, state ) {
    if ( prevState[this.slice] !== state[this.slice] ) {
      this.updateUI( state );
    }
  }

  /**
   * init - Initialize the app view
   * @param { Object } body - The body element of the page
   */
   init( body, store ) {
   	this.inputs = body.querySelectorAll(`input[data-${this.dataProperty}]`);
  	this.elements = body.querySelectorAll(`[data-${this.dataProperty}]`);
  	this.dataSetAttribute = camelCase( this.dataProperty );
    this.store = store;
    this.store.subscribe( this.onStateUpdate.bind(this) );
    this.addInputListeners();
  }
};

export {
  FinancialView
};
