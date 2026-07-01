/// <reference types="cypress" />
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): void;
    }
  }
}

Cypress.Commands.add(
  'login',
  (email = 'user@test.com', password = 'test!1234') => {
    cy.session([email, password], () => {
      cy.visit('/login');
      cy.get('input[id="email"]').type(email);
      cy.get('input[id="password"]').type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/sessions');
    });
  },
);
