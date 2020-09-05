const columnChartOpts = {
  _meterChartBtns: null,

  chart: {
    type: 'column',
    marginRight: 250
  },
  legend: {
    layout: 'vertical',
    backgroundColor: '#FFFFFF',
    floating: true,
    align: 'right',
    itemMarginTop: 10,
    itemStyle: {
      fontSize: '1.2em',
      lineHeight: '3em'
    },
    verticalAlign: 'middle',
    x: -90,
    y: -45,
    labelFormatter: function() {
      return this.name;
    }
  },
  title: false,
  tooltip: false,
  xAxis: {
    categories: [
      '10 year period',
      '25 year period'
    ]
  },
  yAxis: {
    min: 0,
    max: 60000,
    title: '',
    stackLabels: {
      enabled: true,
      format: '${total:,.0f}'
    }
  },
  series: [ {
    name: 'Interest',
    data: [ 0, 0 ],
    color: '#ffe1b9'
  }, {
    name: 'Principal',
    data: [ 0, 0 ],
    color: '#ff9e1b'
  } ],
  plotOptions: {
    series: {
      pointPadding: 0.1,
      dataLabels: {
        enabled: false
      }
    },
    column: {
      stacking: 'normal'
    }
  }
};

const meterOpts = {
  chart: {
    type: 'gauge',
    plotBorderWidth: 0,
    plotBackgroundColor: 'none',
    plotBackgroundImage: null,
    height: 300,
    styledMode: false
  },

  title: {
    text: ''
  },

  pane: [ {
    startAngle: -90,
    endAngle: 90,
    background: null,
    center: [ '50%', '90%' ],
    size: 275
  } ],

  exporting: {
    enabled: false
  },

  tooltip: false,

  yAxis: [ {
    min: 0,
    max: 180,
    lineWidth: 0,
    minorTickInterval: null,
    tickPosition: 'inside',
    tickPositions: [],
    labels: 'none',
    plotBands: [ {
      from: 0,
      to: 60,
      color: '#d14124',
      innerRadius: '90%',
      outerRadius: '110%',
      label: {
        text: '<strong>MIN</strong>',
        align: 'left',
        x: 80,
        y: 75
      }
    }, {
      from: 60,
      to: 120,
      color: '#ff9e1b',
      innerRadius: '90%',
      outerRadius: '110%',
      label: {
        text: '<strong>MEDIAN</strong>',
        align: 'center',
        x: 135,
        y: -15
      }
    }, {
      from: 120,
      to: 180,
      color: '#257675',
      innerRadius: '90%',
      outerRadius: '110%',
      label: {
        text: '<strong>MAX</strong>',
        align: 'right',
        x: -60,
        y: 75
      }
    } ],
    pane: 0,
    title: {
      text: '',
      y: -40
    }
  } ],

  plotOptions: {
    gauge: {
      dataLabels: {
        enabled: false
      },
      dial: {
        radius: '100%'
      }
    }
  },

  series: [ {
    name: '',
    data: [ 50 ],
    yAxis: 0
  } ]

};

const horizontalBarOpts = {
  chart: {
    type: 'bar',
    marginTop: 75,
    height: 250
  },
  title: false,
  subtitle: false,
  xAxis: {
    categories: [],
    title: {
      text: null
    }
  },
  yAxis: {
    min: 0,
    max: 45000,
    stackLabels: {
      enabled: true,
      format: 'Your funding<br>${total:,.0f}',
      align: 'right'
    },
    plotLines: [ {
      color: 'red',
      width: 2,
      value: 25896,
      zIndex: 4,
      label: {
        align: 'center',
        text: 'Cost of Attendance<br>$25,896',
        rotation: 0,
        x: 0,
        y: -25
      }
    } ],
    title: false,
    labels: {
      overflow: 'justify'
    }
  },
  tooltip: false,
  plotOptions: {
    bar: {
      dataLabels: {
        enabled: false
      }
    },
    series: {
      stacking: 'normal'
    }
  },
  legend: {
    enabled: false,
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'top',
    x: -40,
    y: 80,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadow: true
  },
  credits: {
    enabled: false
  },
  series: [ {
    data: [ 10000 ]
  } ]
};

const compareCostOfBorrowingOpts = {
  yAxis: {
    max: 60000
  },
  series: [ {
    name: 'Interest',
    data: [ 6448, 17506 ],
    color: '#ffe1b9'
  }, {
    name: 'Principal',
    data: [ 30000, 30000 ],
    color: '#ff9e1b'
  } ]
};

const costOfBorrowingOpts = {
  xAxis: {
    categories: [
      '10 year period',
      '25 year period'
    ]
  },
  series: [ {
    name: 'Interest',
    data: [ 0 ],
    color: '#ffe1b9'
  }, {
    name: 'Amount borrowed',
    data: [ 1 ],
    color: '#ff9e1b'
  } ]
};

const makePlanOpts = {};

const maxDebtOpts = {
  marginRight: 30,
  yAxis: {
    min: 0,
    max: 45000,
    stackLabels: {
      enabled: true,
      format: '',
      align: 'right',
      x: 10
    },
    plotLines: [ {
      color: 'red',
      width: 2,
      value: 100,
      zIndex: 4,
      label: {
        align: 'center',
        text: '',
        rotation: 0,
        x: 0,
        y: -40
      }
    } ],
    title: false,
    labels: {
      overflow: 'justify'
    }
  },
  series: [ {
    color: '#ff9e1b'
  } ]
};

const affordingOpts = {
  marginRight: 30,
  yAxis: {
    min: 0,
    max: 50000,
    plotLines: [ {
      color: 'red',
      width: 2,
      value: 100,
      zIndex: 4,
      label: {
        align: 'center',
        text: '',
        rotation: 0,
        x: 0,
        y: -40
      }
    } ]
  },
  legend: {
    enabled: true,
    layout: 'vertical',
    align: 'left',
    verticalAlign: 'top',
    x: 20,
    y: -5,
    floating: true,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadow: true
  },
  series: [ {
    data: [ 500 ],
    name: 'Monthly loan payment',
    color: '#ffe1b9'
  }, {
    data: [ 10000 ],
    name: 'Monthly living expenses',
    color: '#ff9e1b'
  } ]
};

const gradMeterOpts = {};

const repaymentMeterOpts = {};

const getRankFromPercentile = ( percentile ) => {
  if ( percentile <= 33 ) {
    return 'bottom third';
  } else if ( percentile <= 66 ) {
    return 'middle third';
  } else {
    return 'top third';
  }
}

export {
  columnChartOpts,
  meterOpts,
  horizontalBarOpts,
  compareCostOfBorrowingOpts,
  costOfBorrowingOpts,
  makePlanOpts,
  maxDebtOpts,
  affordingOpts,
  gradMeterOpts,
  repaymentMeterOpts,
  getRankFromPercentile
}