import { stringToNum } from '../util/number-utils';
import { getStateByCode } from '../util/number-utils';

const programTextMap = {
  programType: {
    certificate: 'certificate',
    associates: 'Associates\'s Degree',
    bachelors: 'Bachelor\'s Degree',
    graduate: 'Graduate\'s Degree'
  },
  programLength: {
    1: '1 year',
    2: '2 years',
    3: '3 years',
    4: '4 years',
    5: '5 years',
    6: '6 years'
  },
  programHousing: {
    onCampus: 'On campus',
    offCampus: 'Off campus (you will pay rent/mortgage)',
    withFamily: 'With family (you will not pay rent/mortgage)'
  },
  programRate: {
    inState: 'In-state',
    outOfState: 'Out of state',
    inDistrict: 'In district'
  }
}

const ratePropertyExtensions = {
  inState: 'InS',
  outOfState: 'Ooss',
  inDistrict: 'InDis'
}

const housingPropertyExtensions = {
  onCampus: 'OnCampus',
  offCampus: 'OffCampus',
}

const otherPropertyExtensions = {
  onCampus: 'OnCampus',
  offCampus: 'OffCampus',
  withFamily: 'WFamily'
}

const getProgramData = function( programs, pid ) {
	for ( let x = 0; x < programs.length; x++ ) {			
		if ( programs[x].code === pid ) {
			return programs[x];
		}
	}
}

/**
* Returns an array of Objects which is alphabetized
* by program name
* @param {string} level - program level - 'undergrad' or 'graduate'
* @returns {array} an array of objects containing program data
*/
const getAlphabeticalProgramList = function( programs ) {
	return programs.sort( ( a, b ) => {
    if ( a.name < b.name ) { 
      return -1; 
    } else if ( a.name > b.name ) { 
      return 1; 
    } else if ( b.name === a.name ) {
      if ( a.level < b.level ) {
        return -1;
      } else if ( a.level > b.level ) {
        return 1;
      }
    }
    return 0;
  } );
}

const getSalary = function( schoolData ) {
	const salary = schoolData.medianAnnualPay6Yr;
	return stringToNum( salary );
}

const getAnnualSalary = function( state ) {
  let salary = 0;
  if ( state.school ) {
    if ( state.program.programType === 'graduate' && state.schoolProgram.pid ) {
      const programData = getProgramData(
        state.school.programsCodes['graduate'],
        state.schoolProgram.pid
      );
      if ( programData.hasOwnProperty( 'salary' ) ) {
        salary = programData.salary;
      }
    }
    salary = stringToNum( state.school.medianAnnualPay6Yr );
  }
  return salary || 0;
}

const getTopPrograms = function( programs ) {
  return programs.slice( 0, 3 ).join( '; ' );
}

const getTextVersion = function( prop, value ) {
	if ( programTextMap[ prop ] ) {
		return programTextMap[prop][value];
	}
}

const getTuitionCosts = function( school, rate, type ) {
  let tuitionProp = type === 'graduate' ? 'tuitionGrad' : 'tuitionUnder';
  if ( ratePropertyExtensions.hasOwnProperty( rate ) ) {
    tuitionProp += ratePropertyExtensions[rate];
  } else {
    tuitionProp += 'InS';
  }
  return stringToNum( school[tuitionProp] );
}

const getHousingCosts = function( school, housing ) {
  if ( housing === 'withFamily' ) {
    return 0;
  }
  const housingProp = 'roomBrd'+ housingPropertyExtensions[housing];
  return stringToNum( school[housingProp] );
}

const getOtherCosts = function( school, housing ) {
  const otherProp = 'other' + otherPropertyExtensions[housing];
  return stringToNum( school[otherProp] );
}

const getBooksCosts = function( school ) {
  return stringToNum( school.books );
}

const getCostsFromSchool = function( state ) {
  const school = state.school;
  const rate = state.program.programRate;
  const type = state.program.programType;
  const housing = state.program.programHousing;
  return {
    tuition_direct: getTuitionCosts( school, rate, type ),
    housing_direct: getHousingCosts( school, housing ),
    other_indirect: getOtherCosts( school, housing ),
    books_indirect: getBooksCosts( school )
  }
}    

export {
	getAlphabeticalProgramList,
	getProgramData,
	getAnnualSalary,
	getTextVersion,
	getTopPrograms,
  getCostsFromSchool
}
