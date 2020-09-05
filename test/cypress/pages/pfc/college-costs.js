export class CollegeCosts {

  open() {
    cy.visit( '/paying-for-college/your-financial-path-to-graduation/' );
  }

  startApp() {
  	cy.get( '.btn__get-started' ).click();
  }

  introSection() {
  	return cy.get( '.college-costs_intro-segment');
  }

  appSection() {
    return cy.get( '.college-costs_app-segment' );
  }

  appContainer() {
    return cy.get( '.college-costs_app-segment' );
  }

  nextButton() {
  	return cy.get( '.btn__next-step');
  }

  nextPage() {
  	return cy.get( '.btn__next-step').click();
  }

  appPage( idx ) {
  	return cy.get('.college-costs_tool-section').eq( idx || 0 ); 
  }

  menu() {
  	return cy.get('.o-college-costs-nav');
  }

  menuSection( idx ) {
  	return cy.get('.o-college-costs-nav').find('.m-list_item__parent').eq( idx || 0 );
  }

  menuSectionLink( section, idx ) {
  	return menuSectionHeader.eq( idx || 0 ).find('.m-nav-link').eq( idx || 0 );
  }

  openMenuSection( idx ) {
  	return menuSectionHeader( idx ).click();
  }




}