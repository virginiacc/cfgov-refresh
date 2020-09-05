import { CollegeCosts } from '../../pages/pfc/college-costs';

const costs = new CollegeCosts();

describe( 'College Costs', () => {

  describe( 'Navigation', () => {

  	it( 'should display intro screen', () => {
      costs.open();
      costs.introSection().should( 'be.visible' );
      costs.appSection().should( 'be.hidden' );
    } );

    it( 'should start app', () => {
      costs.open();
      costs.startApp();
      costs.appSection().should( 'be.visible' );
      costs.introSection().should( 'be.hidden' );
    } );

    it( 'should navigate to the next screen', () => {
      costs.open();
      costs.startApp();
      costs.appPage(0).should( 'be.visible' );
      costs.appPage(1).should( 'be.hidden' );
      costs.nextPage();
      costs.appPage(0).should( 'be.hidden' );
      costs.appPage(1).should( 'be.visible' );
    } );

    it( 'should open a new menu section', () => {
      costs.open();
      costs.startApp();
      costs.menuSectionChildren(1).should( 'be.hidden' );
      costs.openMenuSection( 1 );
      costs.menuSectionChildren(1).should( 'be.visible' );
    } );

    it( 'should navigate to another page via menu', () => {
      
    } );


  } );

} );