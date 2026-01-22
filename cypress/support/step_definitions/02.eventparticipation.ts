import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given("I am logged in as {string} with password {string}", (username: string, password: string) => {
    cy.login(username, password);
});

When('I am on the event overview page for {string}', (eventName: string) => {
  cy.url().should('include', '/home');
  
  cy.contains(eventName, { timeout: 10000 }).should('be.visible').click();
  
  cy.url().should('include', `/event`);
});

When('I press the join event button', () => {
  cy.wait(1000); // Wait for potential animations or loading
  cy.contains("Join event", { timeout: 10000 }).should('be.visible').click();
});

When('I press the leave event button', () => {
  cy.wait(1000); // Wait for potential animations or loading
  cy.contains("Leave event", { timeout: 10000 }).should('be.visible').click();
});

Then('I should be participating in the event', () => {
  cy.contains("Leave event", { timeout: 10000 }).should('be.visible');
});

Then('I should not be participating in the event', () => {
  cy.contains("Join event", { timeout: 10000 }).should('be.visible');
});