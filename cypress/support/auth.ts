declare namespace Cypress {
  interface Chainable {
    logout(): Chainable<void>;
    login(username: string, password: string): Chainable<void>;
    verifySessionstorage(shouldExist: boolean): Chainable<void>;
  }
}

// Logout
Cypress.Commands.add('logout', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="logout-button"]').length > 0) {
      cy.get('[data-testid="logout-button"]').click();
    }
  });
});

// Login
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/login');
  cy.get("[data-testid='username-input']").clear().type(username);
  cy.get("[data-testid='password-input']").clear().type(password);
  cy.get("[data-testid='submit-button']").click();
});

// Verify sessionStorage token
Cypress.Commands.add('verifySessionstorage', (shouldExist: boolean) => {
  cy.window()
    .its('sessionStorage')
    .invoke('getItem', 'loggedInUser')
    .should(shouldExist ? 'exist' : 'not.exist');
});
