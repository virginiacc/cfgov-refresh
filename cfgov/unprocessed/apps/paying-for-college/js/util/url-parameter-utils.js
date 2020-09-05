const parameterMap = {
  iped: ['schoolID', 'school'],

  pid: ['pid', 'schoolProgram'],

  houp: ['programHousing', 'program'],
  typp: ['programType', 'program'],
  lenp: ['programLength', 'program'],
  ratp: ['programRate', 'program'],
  depp: ['programStudentType', 'program'],

  cobs: ['costsQuestion', 'app'],
  oid: ['oid', 'app'],
  iqof: ['impactOffer', 'app'],
  iqlo: ['impactLoans', 'app'],
  utm_source: ['utm_source', 'app'],
  utm_medium: ['utm_medium', 'app'],
  utm_campaign: ['utm_campaign', 'app'],
  regs: ['region', 'app'],

  tuit: ['tuition_direct', 'costs'],
  hous: ['housing_direct', 'costs'],
  diro: ['other_direct', 'costs'],
  book: ['books_indirect', 'costs'],
  tran: ['transportation_indirect', 'costs'],
  indo: ['other_indirect', 'costs'],
  nda: ['other_additional', 'costs'],

  pelg: ['pell_grant', 'awardedFunding'],
  seog: ['seog_grant', 'awardedFunding'],
  fedg: ['federal_grant', 'awardedFunding'],
  stag: ['state_grant', 'awardedFunding'],
  schg: ['school_grant', 'awardedFunding'],
  othg: ['other_grant', 'awardedFunding'],
  mta: ['milTuitAssist_military', 'awardedFunding'],
  gi: ['GIBill_military', 'awardedFunding'],
  othm: ['other_military', 'awardedFunding'],
  stas: ['state_scholarship', 'awardedFunding'],
  schs: ['school_scholarship', 'awardedFunding'],
  oths: ['other_scholarship', 'awardedFunding'],

  wkst: ['workStudy_workStudy', 'workFunding'],
  fell: ['fund_fellowship', 'workFunding'],
  asst: ['fund_assistantship', 'workFunding'],

  subl: ['amount_directSub', 'federalLoans'],
  unsl: ['amount_directUnsub', 'federalLoans'],

  plus: ['amount', 'plusLoans'],

  pers: ['personal_savings', 'personalFunding'],
  fams: ['family_savings', 'personalFunding'],
  '529p': ['collegeSavings_savings', 'personalFunding'],
  offj: ['jobOffCampus_income', 'personalFunding'],
  onj: ['jobOnCampus_income', 'personalFunding'],
  eta: ['employerAssist_income', 'personalFunding'],
  othf: ['other_income', 'personalFunding'],

  insl: ['amount_institutional', 'publicLoans'],
  insr: ['rate_institutional', 'publicLoans'],
  insf: ['fee_institutional', 'publicLoans'],
  stal: ['amount_state', 'publicLoans'],
  star: ['rate_state', 'publicLoans'],
  staf: ['fee_state', 'publicLoans'],
  npol: ['amount_nonprofit', 'publicLoans'],
  npor: ['rate_nonprofit', 'publicLoans'],
  npof: ['fee_nonprofit', 'publicLoans'],

  pvl1: ['privLoan_privLoan1', 'privateLoans'],
  pvr1: ['privloan_privLoanRate1', 'privateLoans'],
  pvf1: ['privloan_privLoanFee1', 'privateLoans'],

  houx: ['housing', 'expenses'],
  fdx: ['food', 'expenses'],
  clhx: ['clothing', 'expenses'],
  trnx: ['transportation', 'expenses'],
  hltx: ['healthcare', 'expenses'],
  entx: ['entertainment', 'expenses'],
  retx: ['retirement', 'expenses'],
  taxx: ['taxes', 'expenses'],
  chcx: ['childcare', 'expenses'],
  othx: ['other', 'expenses'],
  dbtx: ['currentDebt', 'expenses']
};

// generates a reverse map from parameterMap
// (with format: {stateSlice: {stateProp: URLProp}})
// that can be used to build a query string from state slices
function generateReverseMap() {
  let reverseMap = {};
  Object.keys( parameterMap ).forEach( ( key, index ) => {
    let value = parameterMap[key];
    let prop = value[0];
    let slice = value[1];
    if ( !reverseMap[slice] ) {
      reverseMap[slice] = {};
    } 
    reverseMap[slice][prop] = key;
  });
  return reverseMap;
}

/**
 * getQueryVariables - Check the url for queryString and interpret it into an object
 * full of key-value pairs.
 * @returns {Object} key-value pairs of the queryString
 */
function getQueryVariables() {
  const query = window.location.search.substring( 1 );
  const pairs = query.split( '&' );
  const queryVariables = {};
  pairs.forEach( elem => {
    const pair = elem.split( '=' );
    const key = decodeURIComponent( pair[0] );
    const value = decodeURIComponent( pair[1] );
    queryVariables[key] = value;
  } );
  return queryVariables;
}

const determineCostsOfferValue = function( queryObj ) {
  const costParameters = [ 'tuit', 'hous', 'diro', 'book', 'indo', 'nda', 'tran' ];
  let cobs = queryObj.cobs;
  if ( queryObj.hasOwnProperty( 'oid' ) ) {
    cobs = 'o';
  } else if ( typeof cobs === 'undefined' ) {
    if ( costParameters.some(key => queryObj.hasOwnProperty(key)) ) {
      cobs = 'y';
    }
  }
  return cobs;
}

function processQueryObj( queryObj ) {
  let data = {};
  let hasPlus = false;
  let programType = false;
  queryObj.cobs = determineCostsOfferValue( queryObj );
  Object.keys( queryObj ).forEach( ( key, index ) => {
    let value = queryObj[key];
    let parameterData = parameterMap[key];
    let prop = parameterData[0];
    let slice = parameterData[1];
    if ( !data[slice] ) {
      data[slice] = {};
    }
    // TODO: handle slice formatting? financial, costs, expenses
    // should be numbers
    data[slice][prop] = value;
  });
  return data;
}

function getDataFromURL() {
  let queryObj = getQueryVariables();
  return processQueryObj( queryObj );
}

function getQueryStringParams( state, stateToQueryMap ) {
  let data = {};

  Object.keys( stateToQueryMap ).forEach( ( key, index ) => {
    const sliceObj = stateToQueryMap[key];
    let stateObj = state[key];
    Object.keys( sliceObj ).forEach( ( sliceKey, idx ) => {
      // if expenses && region, check values against regional values
      data[sliceObj[sliceKey]] = stateObj[sliceKey];
    });
  });

  return data;
}

/**
 * _buildUrlQueryString - Retrieve values from the models and transform them into a
 * querystring
 * @returns {String} a formatted query string based on model values
 */
function buildQueryString( params ) {
  let query = '?';
  Object.keys( params ).forEach( ( key, index ) => {
    if ( params[key] ) {
      if ( query.length > 1 ) {
        query += '&';
      }
      query += key + '=' + params[key];
    }
  });
  return query === '?' ? '' : query;
}

function updateQueryStringFromState( state, stateToQueryMap ) {
  const params = getQueryStringParams( state, stateToQueryMap );
  return buildQueryString( params );
}

export {
  updateQueryStringFromState,
  getDataFromURL,
  generateReverseMap
};
