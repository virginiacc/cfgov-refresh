import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { toggle, toggleAll } from '../util/other-utils';
import { generateReverseMap, getDataFromURL, updateQueryStringFromState } from '../util/url-parameter-utils';
import { sendAnalyticsEvent } from '../util/analytics.js';

const QUERY_SELECTORS = {
  APP: '.college-costs',
  SECTION: '.college-costs_tool-section',
  SUMMARY_RADIOS: 'input[name="action-plan-radio"]',
  SUMMARY_TABS: '[data-action-plan]',
  FEEDBACK_RADIOS: '[data-impact] .m-form-field input.a-radio',
  RESTART_BUTTON: '[data-app-button="restart"]',
  SAVE_FOR_LATER: '[data-app-button="save-and-finish-later"]',
  SEND_LINK_BUTTON: '#email-your-link',
  SAVE_FOR_LATER:  '[data-app-save-link]'
}

const appView = {
  app: null,
  stateToURLMap: {},
  urlData: {},
  localState: {},
  sections: null,
  summaryRadios: null,
  summaryTabs: null,
  feedbackRadios: null,
  restartButton: null,
  saveForLaterButton: null,
  sendLinkButton: null,

  addButtonListeners: () => {
    const summaryTabEvents = {
      click: appView.handleSummaryTabClick
    };
    appView.summaryRadios.forEach( elem => {
      bindEvent( elem, summaryTabEvents );
    } );
    appView.feedbackRadios.forEach( elem => {
      bindEvent( elem, { click: appView.handleFeedback } );
    } );
    bindEvent( appView.restartButton, { click: appView.handleRestart } );
    bindEvent( appView.saveForLaterButton, { click: appView.handleSaveForLater } );
    bindEvent( appView.sendLinkButton, { click: appView.handleSendLink } );
  },

  handleSummaryTabClick: ( event ) => {
    appView.toggleTabs( appView.summaryTabs, 'actionPlan', event.target.value )
  },

  toggleTabs: ( tabs, attr, value ) => {
    tabs.forEach( elem => {
      toggle( elem, value === elem.dataset[attr] );
    } );
  },

  handleFeedback: event => {
    const button = event.target;
    const parent = closest( button, '.o-form_fieldset' );
    sendAnalyticsEvent( 'Impact question click: ' + parent.dataset.impact, event.target.value );
    localState[parent.dataset.impact] = event.target.value
  },

  handleRestart: event => {
    event.preventDefault();
    sendAnalyticsEvent( 'button click', 'restart' );
    window.location = '.';
  },

  handleSaveForLater: () => {
    sendAnalyticsEvent( 'Save and finish later', window.location.search );
    appView.updateUIState( {'save-for-later': 'active'} );
  },

  handleSendLink: event => {
    sendAnalyticsEvent( 'Email your link click', window.location.search );

    const target = event.target;
    let href = 'mailto:' + document.querySelector( '#finish_email' ).value;
    href += '?subject=Link: Your financial path to graduation&body=';
    href += window.location.href;
    target.setAttribute( 'href', href );
  },

  updateUIState: function( uiStateObj ) {
    const app = appView.app;
    Object.keys( uiStateObj ).forEach( key  => {
      app.dataset[key] = uiStateObj[key];
    } );
  },

  toggleActiveSection: function( activeName ) {
    appView.sections.forEach( elem => {
      if ( elem.dataset.toolSection === activeName ) {
        elem.classList.add( 'active' );
      } else {
        elem.classList.remove( 'active' );
      }
    } );
  },

  /**
   * 
   * @param {object} prevState The last state of the app.
   * @param {object} state The current state of the app.
   */
  onStateUpdate: function( prevState, state ) {
    if ( prevState.navigation != state.navigation ) {
      const activeName = state.navigation.activeSection;
      appView.toggleActiveSection( activeName );
      appView.updateUIState( {'state_activesection': activeName} );
    } else if ( prevState.app.started !== state.app.started && state.app.started ) {
      window.scrollTo( 0, document.querySelector( '.college-costs' ).offsetTop );
      appView.updateUIState( {'state_gotstarted': 'true'} );
    } else if ( state.uiState !== prevState.uiState ) {
      appView.updateUIState( state.uiState );
    }
  },

  /**
   * init - Initialize the app view
   * @param { Object } body - The body element of the page
   */

  init: function( body, store ) {
    this.app = body.querySelector( QUERY_SELECTORS.APP );

    this.sections = body.querySelectorAll( QUERY_SELECTORS.SECTION );
    this.summaryRadios = body.querySelectorAll( QUERY_SELECTORS.SUMMARY_RADIOS );
    this.summaryTabs = body.querySelectorAll( QUERY_SELECTORS.SUMMARY_TABS );
    this.feedbackRadios = body.querySelectorAll( QUERY_SELECTORS.FEEDBACK_RADIOS );
    this.sendLinkButton = document.querySelector( QUERY_SELECTORS.SEND_LINK_BUTTON );
    this.restartButton = document.querySelector( QUERY_SELECTORS.RESTART_BUTTON );
    this.saveForLaterButton = document.querySelector( QUERY_SELECTORS.SAVE_FOR_LATER );

    this.toggleTabs( this.summaryTabs, 'actionPlan' )
    this.addButtonListeners();
    this.store = store;
    this.store.subscribe( this.onStateUpdate );
    this.stateToURLMap = generateReverseMap();
    this.urlData = getDataFromURL();
    this.store.dispatch( actions.fetchInitialData( this.urlData ) );
  }

};

export {
  appView
};
