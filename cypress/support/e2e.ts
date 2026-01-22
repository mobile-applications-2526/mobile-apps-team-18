import './database';
import './auth';

afterEach(() => {
  cy.resetDatabase();
});
