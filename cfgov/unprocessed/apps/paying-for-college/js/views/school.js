import { closest } from '../../../../js/modules/util/dom-traverse';
import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { schoolSearch } from '../util/api';
import { getStateByCode, sanitizeTextOutput, showAll, hideAll } from '../util/other-utils';
import { getTopPrograms } from '../helpers/school-helpers';
import { decimalToPercentString } from '../util/number-utils';

const QUERY_SELECTORS = {
  searchSection: '#college-costs_school-search',
  searchBox: '#search__school-input',
  searchResults: '#search-results',
  schoolInfo: '.school-search_additional-info'
}
const QUERY_SELECTORS_ALL = {
  textOutputs: '[data-school-item]'
}

const schoolView = {
  keyupDelay: null,

  /**
   * Add all event listeners for school search view
   */
  addListeners: () => {
    const searchEvents = {
      keyup: schoolView.handleInputChange
    };
    bindEvent( schoolView.searchBox, searchEvents );

    const searchResultsEvent = {
      click: schoolView.handleResultButtonClick
    };
    bindEvent( schoolView.searchResults, searchResultsEvent );
  },

  formatSearchResults: function( obj ) {
    let html = '<ul>';
    for ( const key in obj ) {
      const school = obj[key];
      html += '\n<li><button role="button" data-school_id="' + school.id;
      html += '" data-schoolname="' + school.schoolname + '"><strong>' + school.schoolname + '</strong>';
      html += '<p><em>' + school.city + ', ' + school.state + '</em></p></button></li>';
    }
    html += '</li>';
    this.searchResults.innerHTML = html;
    this.searchResults.classList.add( 'active' );
  },

  handleInputChange: function( event ) {
    clearTimeout( this.keyupDelay );
    // schoolView.keyupDelay = setTimeout( function() {
    //   const searchTerm = schoolView.searchBox.value;
    //   // TODO - clean up searchbox text, remove non-alphanumeric characters
    //   console.log(searchTerm);
    //   schoolSearch( searchTerm )
    //     .then( resp => {
            // const obj = JSON.parse( responseText );
    //       schoolView.formatSearchResults( obj );
    //     }, error => {
    //       console.log( error );
    //     } );
    // }, 500 );
    const x = {1: {"schoolname": "University of California-Berkeley", "id": 110635, "city": "Berkeley", "nicknames": "Golden Bears", "state": "CA", "url": "/paying-for-college2/understanding-your-financial-aid-offer/api/school/110635/"}, 2: {"schoolname": "Berkeley City College", "id": 125170, "city": "Berkeley", "nicknames": "", "state": "CA", "url": "/paying-for-college2/understanding-your-financial-aid-offer/api/school/125170/"}, 3: {"schoolname": "George Washington University", "id": 131469, "city": "Washington", "nicknames": "Colonials", "state": "DC", "url": "/paying-for-college2/understanding-your-financial-aid-offer/api/school/131469/"}}
    schoolView.formatSearchResults( x );
  },

  handleResultButtonClick: function( event ) {
    const target = event.target;
    let button;
    // Find the button in the clickable area
    if ( target.tagName === 'BUTTON' ) {
      button = target;
    } else {
      button = closest( target, 'BUTTON' );
    }

    // If there's a school_id, then proceed with schoolInfo
    if ( typeof button.dataset.school_id !== 'undefined' ) {
      const iped = button.dataset.school_id;
      schoolView.searchResults.classList.remove( 'active' );
      schoolView.searchBox.value = button.dataset.schoolname;
      schoolView.store.dispatch( actions.fetchSchool( iped ) );
    }
  },

  getComputedValues: function ( values ) {
    const stateName = getStateByCode( values.state );
    const programsTopThree = getTopPrograms( values.programsPopular );
    return { stateName, programsTopThree };
  },

  updateSchoolTextOutputs: function( data ) {
    schoolView.textOutputs.forEach( elem => {
      const prop = elem.dataset.schoolItem;
      let val = data[prop];
      val = sanitizeTextOutput( val );
      if ( prop.substr( 0, 4 ) === 'rate' ) {
        val = decimalToPercentString( val, 0 );
      }
      elem.innerText = val;
    } );
  },

  updateSchoolView: ( school ) => {
    const data = {
      ...school,
      ...schoolView.getComputedValues( school ) 
    };
    schoolView.searchBox.value = school.school;
    schoolView.updateSchoolTextOutputs( data );
  },

  onStateUpdate: function( prevState, state ) {
    const school = state.school;
    const prevSchool = prevState.school;
    if ( prevSchool !== school ) {
        schoolView.updateSchoolView( school );
    }   
  },

  init: function( body, store ) {
    // Set up nodeLists
    Object.keys( QUERY_SELECTORS ).forEach( ( key, index ) => {
      schoolView[key] = body.querySelector( QUERY_SELECTORS[key] );
    });
    Object.keys( QUERY_SELECTORS_ALL ).forEach( ( key, index ) => {
      schoolView[key] = body.querySelectorAll( QUERY_SELECTORS_ALL[key] );
    });
    // Initialize listeners
    schoolView.addListeners();
    this.store = store;
    this.store.subscribe( this.onStateUpdate );
  }

};

export {
  schoolView
};
