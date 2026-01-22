declare namespace Cypress {
  interface Chainable {
    resetDatabase(): Chainable<void>;
  }
}

Cypress.Commands.add('resetDatabase', () => {
  const apiUrl = 'http://localhost:8080';
  cy.request({
    method: 'POST',
    url: `${apiUrl}/data/reset`,
  });
});
