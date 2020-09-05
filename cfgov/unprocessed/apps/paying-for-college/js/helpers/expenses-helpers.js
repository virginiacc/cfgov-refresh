import { stringToNum } from '../util/number-utils';
import { getAnnualSalary } from '../helpers/school-helpers';

const rangeFinder = {
  'less_than_5000': [ 0, 4999 ],
  '5000_to_9999':   [ 5000, 9999 ],
  '10000_to_14999': [ 10000, 14999 ],
  '15000_to_19999': [ 15000, 19999 ],
  '20000_to_29999': [ 20000, 29999 ],
  '30000_to_39999': [ 30000, 39999 ],
  '40000_to_49999': [ 40000, 49999 ],
  '50000_to_69999': [ 50000, 69999 ],
  '70000_or_more':  [ 70000, Infinity ]
}

const getSalaryRange = function( salary ) {
  let arr;
  for ( const key in rangeFinder ) {
    if ( rangeFinder.hasOwnProperty( key ) ) {
      arr = rangeFinder[key];
      if ( salary >= arr[0] && salary <= arr[1] ) {
        return key;
      }
    }
  }
  return 'salary not found';
}

const getRegionalValues = function( region, store, salaryRange ) {
  let expensesData = store.app.rawExpenses;
  let obj = {};
  Object.keys( expensesData ).forEach( ( key, index ) => {
    if ( typeof expensesData[key] == "object" ) {
      let data = expensesData[key];
      let value = stringToNum(data[region][salaryRange]);
      value = Math.round( value / 12 );
      obj[key.toLowerCase()] = value;
    }
  });
  obj.childcare = obj.childcare || 0;
  return obj;
}

const calculateTotalExpenses = function( expenses ) {
  return Object.values( expenses ).reduce( ( a, b ) => a + b, 0 );
}

const calculateRemainder = function ( store, totalExpenses ) {
  const salary = getAnnualSalary( store ) / 12;
  return salary - totalExpenses;
}

const getExpensesByRegion = function( region, store ) {
  const salary = getAnnualSalary( store );
  const salaryRange = getSalaryRange( salary );
  return getRegionalValues( region, store, salaryRange );
}

export {
  calculateRemainder,
  calculateTotalExpenses,
  getExpensesByRegion
}