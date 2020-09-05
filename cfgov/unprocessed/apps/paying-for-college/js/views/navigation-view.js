import { closest } from '../../../../js/modules/util/dom-traverse';
import { bindEvent } from '../../../../js/modules/util/dom-events';
import { sendAnalyticsEvent } from '../util/analytics.js';
import actions from '../actions/actions';

const QUERY_SELECTORS = {
  NAV: '.o-secondary-navigation',
  NAV_SECTION: '.m-list_item__parent',
  NAV_SECTION_LINK: '.m-nav-link__parent',
  NAV_LINK: '[data-nav_item]',
  NEXT_BUTTON: '.college-costs_buttons__next',
  GET_STARTED_BUTTON: '.college-costs_intro-segment .btn__get-started',
}

const navigationView = {
  navMenu: null,
  navSections: null,
  navSectionLinks: null,
  navLinks: null,
  nextButton: null,
  sections: [],
  getStartedBtn: null,

  
  /**
   * addButtonListeners - Add event listeners for nav buttons
   */
   addButtonListeners: function( ) {
    navigationView.navLinks.forEach( elem => {
      const events = {
        click: navigationView.handleNavLinkClick
      };
      bindEvent( elem, events );
    } );

    navigationView.navSectionLinks.forEach( elem => {
      const events = {
        click: navigationView.handleNavSectionClick
      };
      bindEvent( elem, events );
    } );

    bindEvent( navigationView.nextButton, { click: navigationView.handleNextLinkClick } );
    bindEvent( navigationView.getStartedBtn, { click: this.handleStart } );

  },

  handleStart: function () {
    navigationView.store.dispatch( actions.appStarted() );
    navigationView.store.dispatch( actions.updateSection( navigationView.sections[0] ) );
  },

  /**
   * handleNavButtonClick - Handle click event for secondary nav
   * @param {Object} event - click event
   */
   handleNavLinkClick: function( event ) {
    event.preventDefault();
    const target = event.target;
    sendAnalyticsEvent( 'Secondary nav click', target.innerText );
    navigationView.store.dispatch( actions.updateSection( target.dataset.nav_item ) );
  },

  handleNavSectionClick: function( event ) {
    event.preventDefault();
    const target = event.target;
    sendAnalyticsEvent( 'Secondary nav click', target.innerText );
    closest( target, '[data-nav-is-open]' ).setAttribute( 'data-nav-is-open', 'True' );
  },

  /**
   * handleNextButtonClick - handle the click event for the "Next" button
   * @param {Object} event - click event
   */
   handleNextLinkClick: function( event ) {
    // TODO: Track time between Next button clicks for analytics
    //sendAnalyticsEvent( 'next step - ' + navigationView.store.state( 'activeSection' ), 'time-to-click' );
    window.scrollTo( 0, document.querySelector( '.college-costs' ).offsetTop );
    const nextSection = navigationView.getNextSection();
    if ( nextSection ) {
      navigationView.store.dispatch( actions.updateSection( nextSection ) );
    }
  },

  getNextSection: function() {
    const activeSection = navigationView.store.state.navigation.activeSection;
    const sections = navigationView.sections;
    const i = sections.indexOf( activeSection );
    if ( i !== -1 ) {
      return i == sections.length - 1 ? sections[1] : sections[i + 1];
    }
  },

  /**
   * updateSideNav - Update the side nav
   * @param {String} activeName - name of the active app section
   */
   updateSideNav: function( activeName ) {
    // clear active-sections
    navigationView.navLinks.forEach( elem => {
      elem.classList.remove( 'm-nav-link__active' );
      elem.setAttribute( 'aria-selected', false );
    } );

    navigationView.navSections.forEach( elem => {
      elem.setAttribute( 'data-nav-is-active', 'False' );
      elem.setAttribute( 'data-nav-is-open', 'False' );
    } );

    const navLink = document.querySelector( '[data-nav_item="' + activeName + '"]' );
    const activeItem = closest( navLink, 'li' );
    const activeSection = closest( activeItem, 'li' );

    navLink.setAttribute( 'aria-selected', true );
    navLink.classList.add( 'm-nav-link__active' );
    activeSection.setAttribute( 'data-nav-is-open', 'True' );
    activeSection.setAttribute( 'data-nav-is-active', 'True' );
  },

  /**
   * 
   * @param {object} prevState The last state of the app.
   * @param {object} state The current state of the app.
   */
   onStateUpdate: function( prevState, state ) {
    if ( prevState.navigation != state.navigation ) {
      navigationView.updateSideNav( state.navigation.activeSection );
    }
  },

  /**
   * init - Initialize the navigation view
   * @param { Object } body - The body element of the page
   */

   init: function( body, store ) {
    this.navMenu = body.querySelector( QUERY_SELECTORS.NAV );
    this.navSections = this.navMenu.querySelectorAll( QUERY_SELECTORS.NAV_SECTION );
    this.navSectionLinks = this.navMenu.querySelectorAll( QUERY_SELECTORS.NAV_SECTION_LINK );
    this.navLinks = this.navMenu.querySelectorAll( QUERY_SELECTORS.NAV_LINK );
    this.nextButton = body.querySelector( QUERY_SELECTORS.NEXT_BUTTON );
    this.getStartedBtn = body.querySelector( QUERY_SELECTORS.GET_STARTED_BUTTON );
    this.sections = Array.from(this.navLinks).map( elem => {
      return elem.getAttribute( 'data-nav_item' )
    } );
    this.addButtonListeners();
    this.store = store;
    this.store.subscribe( this.onStateUpdate );
    // set first section to active section
    this.store.dispatch( actions.updateSection( navigationView.sections[0] ) );
  }

};

export {
  navigationView
};
