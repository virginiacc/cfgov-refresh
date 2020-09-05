import { promiseRequest } from '../util/promise-request';

const BASE_URL = '/paying-for-college2/understanding-your-financial-aid-offer/api/';

const URLS = {
  constants: BASE_URL + 'constants/',
  expenses: BASE_URL + 'expenses/',
  school: BASE_URL + 'school/',
  schoolSearch: 'https://dev2.demo.cfpb.gov/' + BASE_URL + 'search-schools.json?q='

}
/**
 * getApi - Make an API request to the endpoint specified with parameters specified
 * @param {string} url - URL of API endpoint
 * @param {string} parameter - Additional parameter, if applicable
 * @returns {Object} Promise
 */
const getApi = function( url ) {
  return new Promise( function( resolve, reject ) {
    promiseRequest( 'GET', url )
      .then( function( resp ) {
        resolve( resp );
      } )
      .catch( function( error ) {
        console.log( 'An error occurred accessing ' + url, error );
        reject( new Error( error ) );
      } );
  } );
};

/**
 * schoolSearch - search for schools based on searchTerm
 * @param {String} searchTerm - Term to be searched for
 * @returns {Object} Promise
 */
const schoolSearch = function( searchTerm ) {
  searchTerm = searchTerm.trim();
  if ( searchTerm.length > 2 ) {
    return getApi( URLS.schoolSearch + searchTerm );
  }

  return Promise.reject( new Error( 'Failure - search term too short' ) );
};


/**
 * getConstants - retrieve constants from our API
 * @returns {Object} Promise
 */
const getConstants = function() {
  return getApi( URLS.constants );
};

// getNonMetroData = function ( cb ) {
//     if ( nonMetros ) {
//       return cb( nonMetros );
//     }
//     return ajax( { url: NON_METROS_URL }, function( resp ) {
//       const data = JSON.parse( resp.data );
//       cb( data );
//     } );
//   },
const fetchConstantsData = function( cb ) {
  return new Promise( ( resolve, reject ) => {
      getConstants()
        .then( resp => {
          const data = JSON.parse( resp.responseText );
          cb( data );
          resolve( true );
        } )
        .catch( function( error ) {
          reject( error );
          console.log( 'An error occurred when accessing the constants API', error );
        } );
    } );
}

/**
 * getExpenses - retrieve expense data from our API
 * @returns {Object} Promise
 */
const getExpenses = function() {
  return getApi( URLS.expenses );
};

const fetchExpensesData = function( cb ) {
  return new Promise( ( resolve, reject ) => {
      getExpenses()
        .then( resp => {
          const data = JSON.parse( resp.responseText );
          cb( data );
          resolve( true );
        } )
    } );
}

/**
 * getSchoolData - retrieve school data from our API
 * @param { String } iped - The school's identification number
 * @returns {Object} Promise
 */
const getSchoolData = function( iped ) {
  return getApi( URLS.school + iped );
};

const fetchSchoolData = function( iped, cb ) {
  return new Promise( ( resolve, reject ) => {
      getSchoolData( iped )
        .then( resp => {
          const data = JSON.parse( resp.responseText );
          cb( data );
          resolve( data );
        } )
    } );
}


export {
  schoolSearch,
  fetchConstantsData,
  fetchExpensesData,
  fetchSchoolData,
};