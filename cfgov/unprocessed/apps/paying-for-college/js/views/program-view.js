import { closest } from '../../../../js/modules/util/dom-traverse';
import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { programPropertyToText } from '../helpers/school-helpers';
import { toggleAll } from '../util/other-utils';
import { sanitizeTextOutput } from '../util/other-utils';

const QUERY_SELECTORS_ALL = {
  programRadioLabels: '.school-search_additional-info label',
  programRadioButtons: '.school-search_additional-info .a-radio',
  programTextOutputs: '[data-program-item]',
  associatesContent: '.associates-content',
  undergradContent: '.undergrad-content',
  graduateContent: '.graduate-content'
}

const programView = {
  programRadioProps: null,

  addListeners: () => {
    const radioEvents = {
      click: programView.handleProgramRadioClick
    };
    programView.programRadioLabels.forEach( elem => {
      bindEvent( elem, radioEvents );
    } );
  },

  getRadioProps: ( radios ) => {
    let radioProps = new Set();
    radios.forEach( function( radio ) {
      radioProps.add( radio.name );
    });
    return radioProps;
  },

  handleProgramRadioClick: function( event ) {
    const container = closest( event.target, '.m-form-field' );
    const input = container.querySelector( 'input' );
    const prop = input.getAttribute( 'name' );
    const value = input.value;
    programView.store.dispatch( actions.updateProgram( {[prop]: value} ) );
  },

  toggleContentByProgramType: function( programType ) {
    toggleAll( programView.graduateContent, programType === 'graduate' );
    toggleAll( programView.undergradContent, programType !== 'graduate');
    toggleAll( programView.associatesContent, programType === 'associates');
  },

  updateRadioButtons: ( prevData, data ) => {
    for ( prop in programView.programRadioProps ) {
      if ( prevData[prop] !== data[prop] ){
        let val = data[prop];
        const input = document.querySelector( 'INPUT[name="' + prop + '"][value="' + val + '"]' );
        if ( input ) {
          input.checked = true;
        }
      }
    }
  },

  updateProgramTextOutputs: function( prevData, data ){
    const toTranslate = ['programTypeText', 'programLengthText',
    'programRateText', 'programHousingText'];
    this.programTextOutputs.forEach( elem => {
      const prop = elem.dataset.programItem;
      if ( prevData[prop] !== data[prop] ){
        let val;
        if ( toTranslate.indexOf( prop ) > -1 ) {
          let baseProp = prop.slice( 0, -4 );
          val = programPropertyToText( baseProp, data[baseProp] );
        } else {
          val = data[prop];
        }
        elem.innerText = sanitizeTextOutput( val );
      }
    } );
  },

  onStateUpdate: function( prevState, state ) {
    const prevSchool = prevState.school;
    const school = state.school;
    const program = state.program;
    const prevProgram = prevState.program;
    if ( prevSchool !== school ) {
      if ( school.control === 'private' ) {
        if ( typeof program.programRate !== 'undefined' && program.programRate !== null  ) {
          programView.store.dispatch( actions.updateProgramValue( 'programRate', null ) );
        }
      }
    } else if ( program !== prevProgram ) {
      if ( program.programType !== prevProgram.programType ) {
        programView.toggleContentByProgramType( program.programType );
      }
      programView.updateProgramTextOutputs( prevProgram, program );
      programView.updateRadioButtons( prevProgram, program );
    }
  },

  init: function ( body, store ) {
    // Set up nodeLists
    Object.keys( QUERY_SELECTORS_ALL ).forEach( ( key, index ) => {
      programView[key] = body.querySelectorAll( QUERY_SELECTORS_ALL[key] );
    });
    // Get names of radio elements
    programView.programRadioProps = programView.getRadioProps( programView.programRadioButtons );
    // Initialize listeners
    programView.addListeners();
    // toggle content
    programView.toggleContentByProgramType( 'bachelors' );
    programView.store = store;
    programView.store.subscribe( programView.onStateUpdate );
  }
};

export {
  programView
};
