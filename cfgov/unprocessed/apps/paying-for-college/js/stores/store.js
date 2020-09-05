import Store from '../../../../js/organisms/MortgagePerformanceTrends/stores/store';

const initialState = {
	app: {
		started: false,
	},
	navigation: {
		activeSection: null,
	},
	constants: {},
	costs: {},
	expenses: {},
	awardedFunding: {},
	personalFunding: {},
	workFunding: {},
	federalLoans: {},
	plusLoans: {},
	publicLoans: {},
	privateLoans: {},
	program: {},
	school: {},
	schoolProgram: {}
}

class AppStore extends Store {
  constructor( reducer, middleware ) {
    super( middleware );
    this.reducer = reducer;
    this.state = this.reduce( initialState, {} );
  }

  reduce( state, action ) {
    return this.reducer( state, action );
  }
}

export default AppStore;

