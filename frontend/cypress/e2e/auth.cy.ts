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
  it('should register = invalid credentials error (email)', () => {
    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.contains('Request failed with status code 409');
  });

  it('should register successfully', () => {
    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type(`jerry18@test.com`);
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
  });
});

describe('Promote to admin account', () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  it('should promote account if user', () => {
    cy.login('jerry18@test.com');
    cy.visit('/sessions');
    cy.get('a[href="/profile"]').click();
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
    cy.contains('User');
    cy.contains('button', 'Promote to Admin (Dev)').click();
    cy.contains('Administrator');
  });
});

describe('Delete account', () => {
  beforeEach(() => {
    cy.clearCookies();
  });
  it('should delete account', () => {
    cy.login('jerry18@test.com');
    cy.visit('/sessions');
    cy.get('a[href="/profile"]').click();
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
    cy.contains('button', 'Delete Account').click();
    cy.url().should('include', '/login');
    cy.contains('Login to Yoga Studio');
  });
});
