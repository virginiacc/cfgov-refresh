import { sanitizeOutput, formatOutput } from '../helpers/financial-helpers';

const QUERY_SELECTORS = {
  CONSTANTS_ITEMS: '[data-constants-item]',
}

const constantsView = {
  constantsItems: [],
  updateConstantsItems: function( values ) {
    constantsView.constantsItems.forEach( elem => {
      const prop = elem.dataset.constantsItem;
      let type; 
      if ( prop.toLowerCase().indexOf( 'rate' ) !== -1 ) {
        type = 'rate';
      } else if ( prop.toLowerCase().indexOf( 'fee' ) !== -1 ) {
        type = 'fee';
      }
      let val = values[prop];
      val = sanitizeOutput( val );
      val = formatOutput( val, type );
      elem.innerText = val;
    });
  },

  onStateUpdate: function( prevState, state ) {
    const constants = state.constants;
    if ( prevState.constants !== constants ) {
      constantsView.updateConstantsItems( constants );
    }
  },

  init: function( body, store ) {
    constantsView.constantsItems = document.querySelectorAll( QUERY_SELECTORS.CONSTANTS_ITEMS );
    this.store = store;
    this.store.subscribe( this.onStateUpdate );
  }
}

export {
  constantsView
};