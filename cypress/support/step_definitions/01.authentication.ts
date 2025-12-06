import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I am on the login page', () => {
  cy.visit('/login');
});

When('I enter valid credentials', () => {
  cy.login('nathan', 'nathan123');
});

When('I enter invalid credentials', () => {
  cy.login('NonExistingName', 'NonExistingPassword');
});

Then('I should be redirected to the homepage', () => {
  cy.url().should('include', '/home');
});

Then('I should see a message saying "Login failed, please try again..."', () => {
  cy.contains('Invalid username or password.').should('be.visible');
});
