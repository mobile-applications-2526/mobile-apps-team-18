import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given("I am logged in as {string} with password {string}", (username: string, password: string) => {
    cy.login(username, password);
});

When('I am on the event overview page for event with id {string}', (eventId: string) => {
  cy.visit(`/events/${eventId}`);
});

When('I press the join event button', () => {
  cy.get('[data-cy=join-event-button]').click();
});

When('I press the leave event button', () => {
  cy.get('[data-cy=leave-event-button]').click();
});

Then('I should be participating in the event', () => {
  cy.get('[data-cy=leave-event-button]').should('be.visible');
});

Then('I should not be participating in the event', () => {
  cy.get('[data-cy=join-event-button]').should('be.visible');
});