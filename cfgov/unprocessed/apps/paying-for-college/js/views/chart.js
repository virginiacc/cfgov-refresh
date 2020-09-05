import { closest } from '../../../../js/modules/util/dom-traverse';
import { bindEvent } from '../../../../js/modules/util/dom-events';
import actions from '../actions/actions';
import { getTotalContributions } from '../helpers/financial-helpers';
import { getStateByCode } from '../util/other-utils';
import { calculateTotals } from '../util/other-utils';
import { calculateDebt } from '../util/debt-calculator';
import { getAnnualSalary } from '../helpers/school-helpers';
import Highcharts from 'highcharts/highstock';
import more from 'highcharts/highcharts-more';
import accessibility from 'highcharts/modules/accessibility';

import { 
  columnChartOpts,
  meterOpts,
  horizontalBarOpts,
  compareCostOfBorrowingOpts,
  costOfBorrowingOpts,
  makePlanOpts,
  maxDebtOpts,
  affordingOpts,
} from '../helpers/chart-helpers.js';

// curlies in strings is a way of formatting Highcharts labels
/* eslint-disable no-template-curly-in-string */
more( Highcharts );

const SECTION_ELEMENT = '.college-costs_tool-section';

const CHART_ELEMENTS = {
  costOfBorrowing: '#cost-of-borrowing_chart',
  compareCost: '#compare-cost-of-borrowing_chart',
  makePlan: '#make-a-plan_chart',
  maxDebt: '#max-debt-guideline_chart',
  affording: '#affording-your-loans_chart'
}

const chartView = {
  costOfBorrowing: {
    elem: null,
    chart: null,
    section: null
  },
  compareCost: {
    elem: null,
    chart: null,
    section: null
  },
  makePlan: {
    elem: null,
    chart: null,
    section: null
  },
  maxDebt: {
    elem: null,
    chart: null,
    section: null
  },
  affording: {
    elem: null,
    chart: null,
    section: null
  },


  /**
   * init - Initialize the app view
   * @param { Object } body - The body element of the page
   */

  init: function( body, store ) {
    Object.keys( CHART_ELEMENTS ).forEach( ( chartType, index ) => {
      const elem = body.querySelector( CHART_ELEMENTS[chartType] );
      const section = elem.closest( SECTION_ELEMENT ).dataset.toolSection;
      chartView[chartType]['elem'] = elem;
      chartView[chartType]['section'] = section;
    });

    chartView.store = store;
    chartView.store.subscribe( chartView._onStateUpdate );
    chartView.initCharts();
  },

  initCharts: () => {
    accessibility( Highcharts );

    Highcharts.setOptions( {
      lang: {
        rangeSelectorZoom: '',
        thousandsSep: ','
      }
    } );

    chartView.costOfBorrowing.chart = Highcharts.chart(
      chartView.costOfBorrowing.elem,
      { ...columnChartOpts, ...costOfBorrowingOpts }
    );

    chartView.compareCost.chart = Highcharts.chart(
      chartView.compareCost.elem,
      { ...columnChartOpts, ...compareCostOfBorrowingOpts }
    );

    chartView.makePlan.chart = Highcharts.chart(
      chartView.makePlan.elem,
      { ...horizontalBarOpts, ...makePlanOpts }
    );

    chartView.maxDebt.chart = Highcharts.chart(
      chartView.maxDebt.elem,
      { ...horizontalBarOpts, ...maxDebtOpts }
    );

    chartView.affording.chart = Highcharts.chart(
      chartView.affording.elem,
      { ...horizontalBarOpts, ...affordingOpts }
    );
  },

  updateCostOfBorrowingChart: ( tenYearTotal, tenYearInterest, totalAtGrad ) => {
    chartView.costOfBorrowingChart.yAxis[0].update( {
      max: Math.floor( tenYearTotal * 1.10 )
    } );
    chartView.costOfBorrowing.chart.series[0].setData( [ tenYearInterest ] );
    chartView.costOfBorrowing.chart.series[1].setData( [ totalAtGrad ] );
  },

  updateCostOfBorrowingView: ( state ) => {
    const debts = calculateDebt( state );
    chartView.updateCostOfBorrowingChart(
      debts.debt_tenYearTotal,
      debts.debt_tenYearInterest,
      debts.debt_totalAtGrad
    );
  },

  updateMakePlanChart: ( totalCosts, totalFunding ) => {
    const max = Math.max( totalCosts * 1.1, totalFunding * 1.1 );
    const text = 'Your costs<br>' + numberToMoney( { amount: totalCosts, decimalPlaces: 0 } );
    chartView.makePlan.chart.yAxis[0].update( {
      max: max,
      plotLines: [ {
        color: 'red',
        width: 2,
        value: totalCosts,
        zIndex: 4,
        label: {
          align: 'center',
          text: text,
          rotation: 0,
          x: 0,
          y: -25
        }
      } ]
    } );
    chartView.makePlan.chart.series[0].setData( [ totalFunding ] );
  },

  updateMakePlanView: ( state ) => {
    const totalCosts = getTotals( state.costs );
    const totals = getTotalContributions( state );
    chartView.updateMakePlanChart( totalCosts, totals.funding );
  },

  updateMaxDebtChart: ( totalDebt, salary ) => {
    const max = Math.max( totalDebt * 1.1, salary * 1.1 );
    const text = 'Median salary<br>' + numberToMoney( { amount: salary, decimalPlaces: 0 } );

    chartView.maxDebt.chart.yAxis[0].update( {
      min: 0,
      max: max,
      stackLabels: {
        enabled: true,
        format: 'Projected total debt<br>${total:,.0f}',
        align: 'right'
      },
      plotLines: [ {
        value: salary,
        zIndex: 4,
        label: {
          align: 'center',
          text: text,
          rotation: 0,
          x: 0,
          y: -40
        }
      } ],
      title: false,
      labels: {
        overflow: 'justify'
      }
    } );

    chartView.maxDebt.chart.series[0].setData( [ totalDebt ] );
  },

  updateMaxDebtView: ( state ) => {
    const debts = calculateDebt( state );
    const salary = getAnnualSalary( state );
    chartView.updateMaxDebtChart( debts.debt_totalAtGrad, salary );
  },

  updateAffordingChart: ( monthlyExpenses, monthlyPayment, monthlySalary ) => {
    const max = Math.max( monthlySalary * 1.1, ( monthlyExpenses + monthlyPayment ) * 1.1 );
    const text = 'Monthly Salary<br>' + numberToMoney( { amount: monthlySalary, decimalPlaces: 0 } );
    chartView.affording.chart.yAxis[0].update( {
      max: max,
      plotLines: [ {
        value: monthlySalary,
        zIndex: 4,
        label: {
          align: 'center',
          text: text,
          rotation: 0,
          x: 0,
          y: -30
        }
      } ]
    } );
    chartView.affording.chart.series[0].setData( [ monthlyPayment ] );
    chartView.affording.chart.series[1].setData( [ monthlyExpenses ] );
  },

  updateAffordingView: ( state ) => {
    const debts = calculateDebt( state );
    const payment = debts.debt_tenYearMonthly;
    const expenses = calculateTotals( state.expenses );
    let salary = getAnnualSalary( state );
    
    chartView.updateAffordingChart( expenses, payment, salary / 12);
  },

  handleSectionChange: function ( state ) {
    switch ( state.section ) {
      case chartView.affording.section: {
        chartView.updateAffordingView( state );
      }
      case charView.compareCost.section: {
        chartView.updateCompareCost( state );
      }
      case charView.costOfBorrowing.section: {
        chartView.updateCostOfBorrowing( state );
      }
      case charView.makePlan.section: {
        chartView.updateMakePlanView( state );
      }
      case charView.maxDebt.section: {
        chartView.updateMaxDebt( state );
      }
    }
  },

  /**
   * 
   * @param {object} prevState The last state of the app.
   * @param {object} state The current state of the app.
   */
  _onStateUpdate: function( prevState, state ) {
    const section = state.app.activeSection;
    if ( section !== prevState.app.activeSection ) {
      chartView.handleSectionChange( state );
    } else if ( section === chartView.affording.section && state.expenses !== prevState.expenses ) {
      chartView.updateAffordingView( state );
    } else if ( section === chartView.makePlan.section && state.financial !== prevState.financial ) {
      chartView.updateMakePlanView( state );
    }
  }
};

export {
  chartView
};
