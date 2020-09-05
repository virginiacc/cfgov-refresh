// import { bindEvent } from '../../../../js/modules/util/dom-events';
// import actions from '../actions/actions';

// const QUERY_SELECTORS = {
//   STATE_CONTAINER: 'main.college-costs'
// }

// const uiView = {
//   stateContainer: null
//   updateUIStateProperty: function( uiState ) {
//     for ( prop in uiState ) {
//       if ( uiState.hasOwnProperty( prop ) ) {
//         const value = uiState[prop];
//         if ( value === false || value === null ) {
//           appView.stateContainer.removeAttribute( 'data-state_' + prop );
//         } else {
//           appView.stateContainer.setAttribute( 'data-state_' + prop, value );
//         }
//       }
//     }
//   },

//   onStateUpdate: function( prevState, state ) {
//     if ( prevState.uiState != state.uiState ) {
//       uiView.updateUIStateProperty( state.uiState );
//     } 
//   },

//   init: function( body, store ) {
//     this.stateContainer = body.querySelector( QUERY_SELECTORS.STATE_CONTAINER );
//     this.store = store;
//     this.store.subscribe( this.onStateUpdate );
//   }


//   // 

// };

// export {
//   uiView
// };
