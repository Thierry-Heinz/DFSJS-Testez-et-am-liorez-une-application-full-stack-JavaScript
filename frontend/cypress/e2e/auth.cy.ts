describe('Auth login', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
  });

  it('should invalid credentials error (password)', () => {
    cy.visit('/login');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test234');
    cy.get('button[type="submit"]').click();
    cy.contains('Request failed with status code 401');
  });

  it('should invalid credentials error (email)', () => {
    cy.visit('/login');
    cy.get('input[id="email"]').type('test@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.contains('Request failed with status code 401');
  });
});

describe('Auth register', () => {
  it('should register successfully', () => {
    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type(`jerry+${Date.now()}@test.com`);
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
  });

  it('should register = invalid credentials error (email)', () => {
    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.contains('Request failed with status code 409');
  });
});
