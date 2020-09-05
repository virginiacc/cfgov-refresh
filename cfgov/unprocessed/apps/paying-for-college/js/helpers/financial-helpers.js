import numberToMoney from 'format-usd';
import { decimalToPercentString, enforceRange, stringToNum } from '../util/number-utils';
import { sumObject } from '../util/other-utils';

const getUnsubsidizedRate = function( programType, constants ) {
	return programType === 'graduate' ? 
		constants.unsubsidizedRateGrad : 
		constants.unsubsidizedRateUndergrad;
}

const getPlusRate = function( programType, constants ) {
	return programType === 'graduate' ? 
		constants.rate_gradPlus : 
		constants.rate_parentPlus;
}

const loanAmountAfterFee = function( loan ) {
	const amount = loan.amount || 0;
	const fee = loan.fee;
	if ( amount && fee ) {
		return amount - ( amount * fee );
	}
	return amount;
}

const sumLoans = function( loanObject ) {
	return Object.values( loanObject ).reduce( ( total, value ) => {
			return total += ( loanAmountAfterFee( value ) || 0 );
	}, 0 );
}

const buildLoanObjects = function( obj ) {
	let loans = {};
	Object.keys( obj || {} ).forEach( ( key, index ) => {
		const segments = key.split('_');
		const type = segments.pop();
		const prop = segments[0];
		loans[type] = loans[type] || {};
		loans[type][prop] = obj[key];
	} );
	return loans;
}

const buildPlusLoanObjects = function( plusLoans, state ) {
	let programLevel = state.program.programLevel;
	let constants = state.constants;
	let loans = {};
	if ( plusLoans.amount ) {
		loans.plusLoan = {
			...plusLoans,
			rate: getPlusRate( programLevel, constants ),
			fee: constants.plusOriginationFee
		}
	}
	return loans;
}

const buildFedLoanObjects = function( fedLoans, state ) {
	let programLevel = state.program.programLevel;
	let constants = state.constants;
	let loans = {};
	if ( fedLoans.amount_directUnsub ) {
		loans.directUnsub = {
			amount: fedLoans.amount_directUnsub,
			rate: getUnsubsidizedRate( programLevel, constants ),
			fee: constants.fee_directUnsub //DLOriginationFee
		}
	}
	if ( programLevel !== 'graduate' && fedLoans.amount_directSub ) {
		loans.directSub = {
			amount: fedLoans.amount_directSub,
			rate: constants.rate_directSub, //subsidizedRate
			fee: constants.fee_directSub //DLOriginationFee
		}
	}
	return loans;
}

const buildAllLoanObjects = function( state ) {
	return {
		...buildLoanObjects( state.publicLoans ),
		...buildLoanObjects( state.privateLoans ),
		...buildFedLoanObjects( state.federalLoans, state ),
		...buildPlusLoanObjects( state.plusLoans, state )
	}
}

const getLoanTotals = function( state, loanType ) {
	let loanObject = {};
	let loans = state[loanType];
	if ( loanType === 'federalLoans' ) {
		loanObject = buildFedLoanObjects( loans, state );
	} else if ( loanType === 'plusLoans' ) {
		loanObject = buildPlusLoanObjects( loans, state );
	} else {
		loanObject = buildLoanObjects( loans );
	}
	return { total: sumLoans( loanObject ) };
}

const totalBorrowing = function( state ){
	let loans = buildAllLoanObjects( state );
	return sumLoans( loans );
}

const totalFunding = function( state ) {
	return sumObject({
		...state.awardedFunding,
		...state.personalFunding,
		...state.workFunding
	});
}

const getTotalContributions = function( state ) {
	const funding = totalFunding( state ) || 0;
	const borrowing = totalBorrowing( state ) || 0;
	const contributions = funding + borrowing;
	return { funding, borrowing, contributions }
}

const enforceSubsidizedLoanLimit = function( value, constants ) {
	const subCap = constants.subsidizedCapYearOne;
	const limitViolation = enforceRange( value, 0, subCap );
	return limitViolation ? limitViolation.value : false;
}

const enforceUnsubsidizedLoanLimit = function( value, constants, directSub, program  ) {
  // Calculate unsubsidized loan cap based on subsidized loan amount
  let unsubCap;
  if ( program.programType === 'graduate' ) {
  	unsubCap = constants.unsubsidizedCapGrad;
  } else {
  	const studentType = program.programStudentType;
  	const unsubConstant = studentType === 'independent' ? 
  												'unsubsidizedCapIndepYearOne' : 
  												'unsubsidizedCapYearOne';
  	unsubCap = Math.max( 0, constants[unsubConstant] - directSub );
  }
  const limitViolation = enforceRange( value, 0, unsubCap );
  return limitViolation ? limitViolation.value : false;
}

const enforcePellGrantLimit = function( value, constants ) {
	const cap = constants.pellCap;
	const limitViolation = enforceRange( value, 0, cap );
	return limitViolation ? limitViolation.value : false;
}

const enforceMTAGrantLimit = function( value, constants ) {
	const cap = constants.militaryAssistanceCap;
	const limitViolation = enforceRange( value, 0, cap );
	return limitViolation ? limitViolation.value : false;
}

const enforceFederalLoanLimits = function( prop, val, state ) {
  if ( prop === 'amount_directSub' ) {
	  return enforceSubsidizedLoanLimit( val, state.constants );
	} else if ( prop === 'amount_directUnsub' ) {
	  return enforceUnsubsidizedLoanLimit( 
	  	val,
	  	state.constants,
	  	state.federalLoans.amount_directSub || 0,
	  	state.program
	  );
	}
	return false;
}

const enforceGrantLimits = function( prop, val, constants ) {
  if ( prop === 'pell_grant' ) {
    return enforcePellGrantLimit( val, constants );
  } else if ( prop === 'mta_grant' ) {
    return enforceMTAGrantLimit( val, constants );
  }
  return false;
}

const sanitizeOutput = function( val ) {
  // Prevent improper property values from presenting on the page
  if ( val === false || val === null || isNaN( val ) ) {
  	return 0;
  }
  return val;
}

const formatOutput = function( val, valType) {
	if ( valType === 'fee' ) {
		return decimalToPercentString( val, 3 );
	} else if ( valType === 'rate' ) {
		return decimalToPercentString( val, 2 );
	} else if ( valType === 'number' ) {
		return Math.round( val * 100 ) / 100;
	} else {
		return numberToMoney( { amount: val, decimalPlaces: 0 } );
	}
}

export {
	enforceFederalLoanLimits,
	enforceGrantLimits,
	sanitizeOutput,
	formatOutput,

	getTotalContributions,
	getLoanTotals,

	buildPlusLoanObjects,
	buildFedLoanObjects,
	buildLoanObjects,
	buildAllLoanObjects
}