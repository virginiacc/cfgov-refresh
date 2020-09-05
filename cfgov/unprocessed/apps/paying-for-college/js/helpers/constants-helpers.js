import { assign } from '../../../youth-employment-success/js/util';

const constantsFinancialMap = {
  rate_directSub: 'subsidizedRate',
  fee_directSub: 'DLOriginationFee',
  rate_directUnsub: 'unsubsidizedRate',
  fee_directUnsub: 'DLOriginationFee',
  rate_gradPlus: 'gradPlusRate',
  fee_gradPlus: 'plusOriginationFee',
  rate_parentPlus: 'parentplusRate',
  fee_parentPlus: 'plusOriginationFee'
}

const formatConstantsData = function( data ) {
  let obj = {};
  for ( const key in data ) {
    if ( data.hasOwnProperty( key ) ) {
      let value = data[key];

      if ( key != 'constantsYear' ) {
        value = Number( value );
      }
      obj[key] = value;
    }
  }
  return obj;
}

// TODO: can we just use the API values directly instead of creating this object?
const setupCaps = function( data ) {
  return {
    subCaps: {
      yearOne: data.subsidizedCapYearOne,
      yearTwo: data.subsidizedCapYearTwo,
      yearThree: data.subsidizedCapYearThree
    },
    totalCaps: {
      yearOne: data.unsubsidizedCapYearOne,
      yearTwo: data.unsubsidizedCapYearTwo,
      yearThree: data.unsubsidizedCapYearThree
    },
    totalIndepCaps: {
      yearOne: data.unsubsidizedCapIndepYearOne,
      yearTwo: data.unsubsidizedCapIndepYearTwo,
      yearThree: data.unsubsidizedCapIndepYearThree
    }
  }
}

const setupFinancialConstants = function( data ) {
  let obj = {};
  for ( const key in constantsFinancialMap ) {
    if ( constantsFinancialMap.hasOwnProperty( key ) ) {
      const rosetta = constantsFinancialMap[key];
      obj[key] = data[rosetta];
    }
  }
  return obj;
}

const processConstantsData = function( data ) {
  return {
    ...formatConstantsData( data ),
    ...setupCaps( data ),
    ...setupFinancialConstants( data )
  };
}

export {
  processConstantsData
};