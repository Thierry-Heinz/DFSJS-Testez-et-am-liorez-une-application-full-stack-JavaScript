describe('Auth login', () => {
  it('should login successfully', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'user@test.com',
        firstName: 'Test',
        lastName: 'User',
        admin: false,
        token: 'fake-jwt-token',
      },
    }).as('login');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );

    cy.visit('/login');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.url().should('include', '/sessions');
  });

  it('should invalid credentials error (password)', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid Credentials' },
    }).as('loginError');

    cy.visit('/login');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginError');
    cy.contains('Request failed with status code 401');
  });

  it('should invalid credentials error (email)', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid Credentials' },
    }).as('loginError');

    cy.visit('/login');
    cy.get('input[id="email"]').type('test@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginError');
    cy.contains('Request failed with status code 401');
  });
});

describe('Auth register', () => {
  it('should register = invalid credentials error (email)', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 409,
      body: { message: 'Email already exists' },
    }).as('registerError');

    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type('user@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerError');
    cy.contains('Request failed with status code 409');
  });

  it('should register successfully', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: false,
        token: 'fake-jwt-token',
      },
    }).as('register');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );

    cy.visit('/register');
    cy.get('input[id="firstname"]').type('Jerry');
    cy.get('input[id="lastName"]').type('Lewis');
    cy.get('input[id="email"]').type('jerry18@test.com');
    cy.get('input[id="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@register');
    cy.url().should('include', '/sessions');
  });
});

describe('Promote to admin account', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should promote account if user', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: false,
        token: 'fake-jwt-token',
      },
    }).as('login');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );
    cy.intercept('GET', '/api/user/50', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: false,
        createdAt: '2026-06-18T08:36:05.325Z',
        updatedAt: '2026-06-18T08:36:05.325Z',
      },
    }).as('getUser');
    cy.intercept('POST', '/api/user/promote-admin', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: true,
      },
    }).as('promote');

    cy.login('jerry18@test.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('a[href="/profile"]').click();
    cy.wait('@getUser');
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
    cy.contains('User');

    // si la page refetch après promotion, refléter le nouvel état
    cy.intercept('GET', '/api/user/50', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: true,
        createdAt: '2026-06-18T08:36:05.325Z',
        updatedAt: '2026-06-18T08:36:05.325Z',
      },
    }).as('getUserAfterPromote');

    cy.contains('button', 'Promote to Admin (Dev)').click();
    cy.wait('@promote');
    cy.contains('Administrator');
  });
});

describe('Delete account', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should delete account', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: false,
        token: 'fake-jwt-token',
      },
    }).as('login');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );
    cy.intercept('GET', '/api/user/50', {
      statusCode: 200,
      body: {
        id: 50,
        email: 'jerry18@test.com',
        firstName: 'Jerry',
        lastName: 'Lewis',
        admin: false,
        createdAt: '2026-06-18T08:36:05.325Z',
        updatedAt: '2026-06-18T08:36:05.325Z',
      },
    }).as('getUser');
    cy.intercept('DELETE', '/api/user/50', { statusCode: 200 }).as(
      'deleteAccount',
    );

    cy.login('jerry18@test.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('a[href="/profile"]').click();
    cy.wait('@getUser');
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
    cy.contains('button', 'Delete Account').click();
    cy.wait('@deleteAccount');
    cy.url().should('include', '/login');
    cy.contains('Login to Yoga Studio');
  });
});
