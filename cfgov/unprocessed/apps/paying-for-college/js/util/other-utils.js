const HIDDEN_CLASS = 'u-hidden';

const statesByCode = {
  AZ: 'Arizona',
  AL: 'Alabama',
  AK: 'Alaska',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};

function getStateByCode( code ) {
  return statesByCode[code];
}

function sanitizeTextOutput( val ) {
  if ( typeof val === 'undefined' || val === false || val === null ) {
    return '';
  }
  return val;
}

function show( elem ) {
  if ( !elem ) return;
  elem.classList && elem.classList.remove( HIDDEN_CLASS );
}

function hide( elem ) {
  if ( !elem ) return;
  elem.classList && elem.classList.add( HIDDEN_CLASS );
}

function showAll( nodeList ) {
  if ( nodeList.length > 0 ) {
    nodeList.forEach( elem => {
      show( elem );
    });
  }
}

function hideAll( nodeList ) {
  if ( nodeList.length > 0 ) {
    nodeList.forEach( elem => {
      hide( elem );
    });
  }
}

function toggle( elem, on ) {
  if ( elem ) {
    const updateDisplay = on ? show : hide;
    updateDisplay( elem );
  }
}

function toggleAll( nodeList, on ) {
  if ( nodeList.length > 0 ) {
    const updateDisplay = on ? show : hide;
    nodeList.forEach( elem => {
      updateDisplay( elem );
    });
  }
}

function camelCase( str ) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function sumObject( obj ) {
  return Object.values( obj ).reduce( ( a, b ) => a + ( b || 0 ), 0 );
}

function calculateSubtotals( obj ) {
  let subtotals = {};
  Object.keys( obj ).forEach( ( key, index ) => {
    const type = 'total_' + key.split('_').pop();
    subtotals[type] = subtotals[type] || 0;
    subtotals[type] += obj[key] || 0;
  } );
  return subtotals;
}

function calculateTotals( obj ) {
  return sumObject( obj ) || 0;  
}

export {
  getStateByCode,
  sanitizeTextOutput,
  toggle,
  toggleAll,
  show,
  hide,
  showAll,
  hideAll,
  camelCase,
  sumObject,
  calculateSubtotals,
  calculateTotals
};
