import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { getAlphabeticalProgramList, getProgramData } from '../helpers/school-helpers';
import { toggle, toggleAll } from '../util/other-utils';
import { sanitizeTextOutput } from '../util/other-utils';

const QUERY_SELECTORS = {
  PROGRAM_TEXT_OUTPUT: '[data-school-program]',
  PROGRAM_SELECT: '#program-select',
  NO_PROGRAMS_MESSAGE: '[data-state-based-visibility="school-no-programs"]',
  PROGRAM_SELECTED_CONTENT: '[data-state-based-visibility="no-program-selected"]',
  PROGRAM_NOT_SELECTED_CONTENT: '[data-state-based-visibility="no-program-selected"]',
}

const schoolProgramView = {
  programTextOutput: null,
  programSelect: null,
  noProgramsMessage: null,
  programSelectedContent: null,
  programNotSelectedContent: null,

  /**
   * Add all event listeners for view
   */
  addListeners: () => {
    const programSelectEvents = {
      change: schoolProgramView.handleProgramSelectChange
    };
    bindEvent( schoolProgramView.programSelect, programSelectEvents );
  },

  handleProgramSelectChange: function( event ) {
    let target = event.target;
    schoolProgramView.store.dispatch( actions.updateSelectedProgram( {
      pid: target.value,
      salary: target.options[target.selectedIndex].dataset.programSalary,
      programName: target.options[target.selectedIndex].innerText
    } ) );
  },

  updateText: function( data ){
    schoolProgramView.programTextOutput.forEach( elem => {
      const prop = elem.dataset.programItem;       
      elem.innerText =  sanitizeTextOutput( data[prop] ) ;
    } );
  },

  updateProgramSelectOptions: ( list ) => {
    if ( list.length > 0 ) {
      let html = '<option selected="selected" value="null">Select...</option>';
      list.forEach( elem => {
        html += `
          <option data-program-salary="${ elem.salary }" value="${ elem.code }">
                ${ elem.level } - ${ elem.name }
          </option>`;
      } );
      html += '\n<option value="null">My program is not listed here.</option>';
      schoolProgramView.programSelect.innerHTML = html;
    }
  },

  selectOption: ( pid )  => {
    schoolProgramView.programSelect.value = pid;
  },

  getProgramList: function( school, programType ) {
    let programs = school.programCodes[programType];
    if ( programs.length > 0 ) {
      return getAlphabeticalProgramList( programs );
    }
    return false;
  },

  handleStateChange: function( school, programType, schoolProgram ) {
    // when school or undergrad/grad selection has changed,
    // get the program list (if any), update the select, and toggle the
    // select based on presence of program list.
    let pid = schoolProgram.pid;
    let programs;
    if ( programType === 'graduate' ) {
      programs = schoolProgramView.getProgramList( school, programType );
      if ( programs ) {
        schoolProgramView.updateProgramSelectOptions( programs );
      }
    }
    toggle( schoolProgramView.programSelect, !!programs );
    toggleAll( schoolProgramView.noProgramsMessage, programType === 'graduate' && !programs );
    if ( pid !== null ) {
        schoolProgramView.store.dispatch( actions.clearProgram() );
    }
  },

  handleProgramUpdate: function( program ) {
    // when the school program has changed, update the select 
    // and text with the new value, and toggle display of program text
    // based on whether there is a current program
    schoolProgramView.selectOption( program.pid );
    schoolProgramView.updateText( program );
    toggleAll( schoolProgramView.programSelectedContent, !!program.programName );
    toggleAll( schoolProgramView.programNotSelectedContent, !program.programName );
  },

  onStateUpdate: function( prevState, state ) {
    const school = state.school;
    const programType = state.program.programType;
    const schoolProgram = state.schoolProgram;
    const hasPrograms = false;
    if ( school !== prevState.school || programType !== prevState.program.programType ) {
      schoolProgramView.handleStateChange( school, programType, schoolProgram );
    } else if ( schoolProgram !== prevState.schoolProgram ) {
      schoolProgramView.handleProgramUpdate( schoolProgram );
    }
  },

  init: function ( body, store ) {
    // Set up nodeLists
    schoolProgramView.programSelect = body.querySelector( QUERY_SELECTORS.PROGRAM_SELECT );
    schoolProgramView.programTextOutput = document.querySelectorAll( QUERY_SELECTORS.PROGRAM_TEXT_OUTPUT );
    schoolProgramView.noProgramsMessage = document.querySelectorAll( QUERY_SELECTORS.NO_PROGRAM_MESSAGE );
    schoolProgramView.programSelectedContent = document.querySelectorAll( QUERY_SELECTORS.PROGRAM_SELECTED_CONTENT );
    schoolProgramView.programNotSelectedContent = document.querySelectorAll( QUERY_SELECTORS.PROGRAM_NOT_SELECTED_CONTENT );
    // Initialize listeners
    schoolProgramView.addListeners();
    // Hide the select and the program text outputs
    toggle( schoolProgramView.programSelect );
    toggle( schoolProgramView.noProgramsMessage );
    toggleAll( schoolProgramView.programSelectedContent );
    toggleAll( schoolProgramView.programNotSelectedContent );
    this.store = store;
    this.store.subscribe( this.onStateUpdate );
  }
};

export {
  schoolProgramView
};
