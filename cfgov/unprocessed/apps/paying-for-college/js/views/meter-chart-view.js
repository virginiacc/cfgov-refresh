import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { getStateByCode, toggle } from '../util/other-utils';
import Highcharts from 'highcharts/highstock';
import more from 'highcharts/highcharts-more';
import accessibility from 'highcharts/modules/accessibility';

import { 
  meterOpts,
  gradMeterOpts,
  repaymentMeterOpts,
  getRankFromPercentile
} from '../helpers/chart-helpers.js';

// curlies in strings is a way of formatting Highcharts labels
/* eslint-disable no-template-curly-in-string */
more( Highcharts );

const METER_CHART_SECTION = 'school-results';
const METER_CHART_BUTTONS = '.school-results_cohort-buttons input.a-radio';
const METER_CHART_SELECTORS = {
  gradRate: {
    elem:  '#school-results_grad-meter',
    section: '.school-results_comparison-section__grad-rate',
    circle: '.school-results_comparison-section__grad-rate .big-percentile',
    rankTextContainer: '[data-state-item="gradMeterThird"]',
    cohortTextContainer: '[data-state-item="gradMeterCohortName"]',
  },
  repayRate: {
    elem: '#school-results_repayment-meter',
    section: '.school-results_comparison-section__repayment-rate',
    circle: '.school-results_comparison-section__repayment-rate .big-percentile',
    rankTextContainer: '[data-state-item="repayMeterThird"]',
    cohortTextContainer: '[data-state-item="repayMeterCohortName"]',
  },
  defaultRate: {
    section: '.school-results_comparison-section__default-rate',
    circle: '.school-results_comparison-section__default-rate .big-percentile'
  }
}

const meterChartView = {
  gradRate: {
    elem: null,
    radio: null,
    chart: null,
    section: null,
    circle: null,
    rankTextContainer: null,
    cohortTextContainer: null,
    chartProp: 'grad_rate'
  },
  repayRate: {
    elem: null,
    radio: null,
    chart: null,
    section: null,
    circle: null,
    rankTextContainer: null,
    cohortTextContainer: null,
    chartProp: 'repay_3yr'
  },
  defaultRate: {
    section: null,
    circle: null,
    chartProp: 'default_rate'
  },
  
  /**
   * init - Initialize the app view
   * @param { Object } body - The body element of the page
   */

  init: function( body, store ) {
    meterChartView.meterChartBtns = body.querySelectorAll( METER_CHART_BUTTONS );

    Object.keys( METER_CHART_SELECTORS ).forEach( ( key, index ) => {
      const chartObj = METER_CHART_SELECTORS[key];
      Object.keys( chartObj ).forEach( ( prop, idx ) => {
        meterChartView[key][prop] = body.querySelector( chartObj[prop] );
      });
    });
    meterChartView.addRadioListeners();
    meterChartView.store = store;
    meterChartView.store.subscribe( meterChartView.onStateUpdate );
    meterChartView.initMeterButtons();
    meterChartView.initCharts();
  },

  handleRadioClicks: event => {
    const target = event.target;
    const cohort = target.value;
    const graph = target.getAttribute( 'name' );
    if ( graph === 'graduation-rate-meter-selector' ) {
      meterChartView.updateMeterView( cohort, meterChartView.gradRate );
    } else if ( graph === 'repayment-rate-meter-selector' ) {
      meterChartView.updateMeterView( cohort, meterChartView.repayRate );
    }
  },

  initMeterButtons: () => {
    document.querySelector( '#graduation-rate_us' ).checked = true;
    document.querySelector( '#repayment-rate_us' ).checked = true;
  },

  initCharts: () => {
    accessibility( Highcharts );

    Highcharts.setOptions( {
      lang: {
        rangeSelectorZoom: '',
        thousandsSep: ','
      }
    } );

    meterChartView.gradRate.chart = Highcharts.chart(
      meterChartView.gradRate.elem,
      { ...meterOpts, ...gradMeterOpts }
    );

    meterChartView.repayRate.chart = Highcharts.chart(
      meterChartView.repayRate.elem,
      { ...meterOpts, ...repaymentMeterOpts }
    );
  },

  addRadioListeners: () => {
    const radioEvents = {
      click: meterChartView.handleRadioClicks
    };
    meterChartView.meterChartBtns.forEach( elem => {
      bindEvent( elem, radioEvents );
    } );
  },

  getCohortName: ( cohort, school ) =>  {
    switch ( cohort ) {
      case 'cohortRankByControl': {
        if ( school.hasOwnProperty( 'control' ) ) {
          return school.control;
        }
      }
      case 'cohortRankByState': {
        if ( school.hasOwnProperty( 'state' ) ) {
          return getStateByCode( school.state );
        }
      }
      default:
        return 'U.S.';
    }
  },

  updateMeterView: function( cohort, chartObj ) {
    const school = meterChartView.store.state.school;
    const cohortData = school[cohort];
    const data = cohortData[chartObj.chartProp];
    toggle( chartObj.section, !!data );
    if ( data ) {
      const percentile = data.percentile_rank;
      const third = getRankFromPercentile( percentile );
      chartObj.chart.series[0].setData( [percentile / 100 * 180] );
      chartObj.rankTextContainer.innerText = third;
      chartObj.cohortTextContainer.innerText = meterChartView.getCohortName( cohort, school );
      chartObj.circle.dataset.percentile = third;
    }
  },

  updateDefaultRateCircle: function() {
    const school = meterChartView.store.state.school;
    const obj = meterChartView.defaultRate;
    const val = school[obj.chartProp];
    if ( school.hasOwnProperty( 'defaultRate' ) ) {
      const third = getRankFromPercentile( school.defaultRate * 100 );
      obj.circle.dataset.percentile = third;
    }
  },

  /**
   * 
   * @param {object} prevState The last state of the app.
   * @param {object} state The current state of the app.
   */
  onStateUpdate: function( prevState, state ) {
    const programType = state.program.programType;
    const section = state.navigation.activeSection;
    if ( prevState.navigation.activeSection !== section && section === METER_CHART_SECTION ) {
      if ( programType !== 'graduate' && state.school.school ) {
        meterChartView.updateDefaultRateCircle();
        const gradCohort = document.querySelector('[name="graduation-rate-meter-selector"]:checked').value;
        meterChartView.updateMeterView( gradCohort, meterChartView.gradRate );
        const repayCohort = document.querySelector('[name="graduation-rate-meter-selector"]:checked').value;
        meterChartView.updateMeterView( gradCohort, meterChartView.repayRate );
      }
    }
  }
};

export {
  meterChartView
};
