import { calcInterestAtGrad, calcMonthlyPayment } from './debt-utils.js';
import { buildAllLoanObjects } from '../helpers/financial-helpers.js';
// Please excuse some uses of underscore for code/HTML property clarity!
/* eslint camelcase: ["error", {properties: "never"}] */

function getTotalCaps( level, dependency, constants ){
  let totalCaps
  if ( level === 'graduate' ) {
      const gradCap = constants.unsubsidizedCapGrad;
      totalCaps = {
        yearOne: gradCap,
        yearTwo: gradCap,
        yearThree: gradCap
      };
    } else {
      if (  dependency === 'dependent' ) {
        totalCaps = constants.totalCaps;
      } else if ( dependency === 'independent' ) {
        totalCaps = constants.totalIndepCaps;
      }
    } 
  return totalCaps;
}

function addDirectLoanDebt( loans, program, constants) {
  const level = program.programType;
  const dependency = program.programStudentType;
  const programLength = program.programLength;
  let percentSub = 1;
  let percentUnsub = 1;
  let subPrincipal = 0;
  let unsubPrincipal = 0;
  let unsubInterest = 0;
  const subCaps = constants.subCaps;

  let directSubLoan = loans.directSub || {};
  let directUnsubLoan = loans.directUnsub || {};

  let directSub = directSubLoan.amount || 0;
  let directUnsub = directUnsubLoan.amount || 0;
  let rateUnsub = directUnsubLoan.rate;
  let rateSub = directSubLoan.rate;

  if ( directSub || directUnsub ) {
    let totalCaps = getTotalCaps( level, dependency, constants )
    // Determine percent of borrowing versus caps
    percentSub = directSub / subCaps.yearOne;
    percentUnsub = directUnsub / ( totalCaps.yearOne - directSub );

    // Iterate through each year of the program
    for ( let x = 0; x < programLength; x++ ) {
      if ( x === 0 ) {
        subPrincipal += directSub;
        unsubPrincipal += directUnsub;
        unsubInterest += directUnsub * rateUnsub * programLength;
      } else if ( x === 1 ) {
        const subAmount = percentSub * subCaps.yearTwo;
        const unsubAmount = percentUnsub * ( totalCaps.yearTwo - subAmount );
        subPrincipal += subAmount;
        unsubPrincipal += unsubAmount;
        unsubInterest += unsubAmount * rateUnsub * ( programLength - x );
      } else {
        const subAmount = percentSub * subCaps.yearThree;
        const unsubAmount = percentUnsub * ( totalCaps.yearThree - subAmount );
        subPrincipal += subAmount;
        unsubPrincipal += unsubAmount;
        unsubInterest += unsubAmount * rateUnsub * ( programLength - x );
      }
    }
    if ( subPrincipal ) {
      loans.directSub.principal = subPrincipal;
    }
    if ( unsubPrincipal ) {
      loans.directUnsub.principal = unsubPrincipal;
      loans.directUnsub.interest = unsubInterest;
    }
  }
  return loans;
}

/**
 * Calculate debts based on financial values
 */
function debtCalculator(  loans, program, constants ) {
  loans = addDirectLoanDebt( loans, program, constants );
  const debts = {
    totalAtGrad: 0,
    tenYearTotal: 0,
    tenYearMonthly: 0,
    tenYearInterest: 0,
    twentyFiveYearTotal: 0,
    twentyFiveYearMonthly: 0,
    twentyFiveYearInterest: 0,
    totalBorrowing: 0
  };
  const interest = {
    totalAtGrad: 0
  };

  let programLength = program.programLength;

  Object.values(loans).forEach( loan => {
    let int = 0;
    let principal = 0;
    if ( loan.hasOwnProperty('principal') ) {
      int = loan.interest;
      principal = loan.principal;
    } else {
      principal = loan.amount * programLength;
      int = calcInterestAtGrad(
        loan.amount,
        loan.rate,
        programLength );
    }

    if ( isNaN( int ) ) {
      int = 0;
    }

    debts.totalBorrowing += principal;
    let debtVal = int + principal;
  
    interest.totalAtGrad += int;
    debts.totalAtGrad += debtVal;

    // 10 year term calculations
    let tenYearMonthly = calcMonthlyPayment(
      debtVal,
      loan.rate,
      10
    );

    if ( isNaN( tenYearMonthly ) ) {
      tenYearMonthly = 0;
    }

    debts.tenYearMonthly += tenYearMonthly;
    debts.tenYearTotal += tenYearMonthly * 120;

    // 25 year term calculations
    let twentyFiveYearMonthly = calcMonthlyPayment(
      debtVal,
      loan.rate,
      10
    );

    if ( isNaN( twentyFiveYearMonthly ) ) {
      twentyFiveYearMonthly = 0;
    }

    debts.twentyFiveYearMonthly += twentyFiveYearMonthly;
    debts.twentyFiveYearTotal += twentyFiveYearMonthly * 300;
  } );

  debts.programInterest = interest.totalAtGrad;
  debts.tenYearInterest = debts.tenYearTotal - debts.totalAtGrad;
  debts.twentyFiveYearInterest = debts.twentyFiveYearTotal - debts.totalAtGrad;
  debts.repayHours = debts.tenYearMonthly / 15;
  debts.repayWorkWeeks = debts.repayHours / 40;

  return debts;
}

const calculateDebt = function( state ) {
  let loans = buildAllLoanObjects( state );
  return debtCalculator(
    loans,
    state.program,
    state.constants
  )
}


export {
  calculateDebt
};
