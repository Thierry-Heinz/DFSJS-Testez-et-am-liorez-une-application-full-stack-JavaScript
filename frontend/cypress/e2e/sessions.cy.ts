describe('Sessions', () => {
  it('should view sessions', () => {
    cy.login();
    cy.visit('/sessions');
    cy.contains('Yoga Sessions');
  });

  it('should view Profile', () => {
    cy.login();
    cy.visit('/sessions');
    cy.get('a[href="/profile"]').click();
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
  });

  it('should view create session if admin (navbar link)', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.get('nav a[href="/sessions/create"]').click();
    cy.url().should('include', '/sessions/create');
    cy.contains('Create New Session');
  });

  it('should view create session if admin (button link)', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.get('div.container a[href="/sessions/create"]').last().click();
    cy.contains('Create New Session');
  });

  it('should logout and view login', () => {
    cy.login();
    cy.visit('/sessions');
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/login');
    cy.contains('Login to Yoga Studio');
  });
});

describe('Sessions Details', () => {
  it('should view session details', () => {
    cy.login();
    cy.visit('/sessions');
    cy.get('a[href^="/sessions/"]').first().click();
    cy.contains('Details');
    cy.contains('Back to Sessions');
  });

  it('should join session', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    });
    cy.intercept('POST', '/api/session/4/participate/*').as('participate');
    cy.login();
    cy.visit('/sessions/4');
    cy.contains('button', 'Join Session').click();

    cy.contains('Leave Session');
  });

  it('should leave session', () => {
    cy.intercept('GET', '/api/session/4', { fixture: 'session-joined.json' });
    cy.intercept('DELETE', '/api/session/4/participate/*').as('unparticipate');
    cy.login();
    cy.visit('/sessions/4');
    cy.contains('button', 'Leave Session').click();

    cy.contains('Join Session');
  });

  it('should go to session/edit if admin', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions/4');
    cy.contains('button', 'Edit').click();
    cy.url().should('include', '/sessions/edit');
    cy.contains('Edit Session');
  });

  it('should go back to sessions (navbar)', () => {
    cy.login();
    cy.visit('/sessions/4');
    cy.contains('button', 'Back to Sessions').click();
    cy.url().should('include', '/sessions');
  });

  it('should go back to sessions (button)', () => {
    cy.login();
    cy.visit('/sessions/4');
    cy.get('a[href="/sessions"]').click();
    cy.url().should('include', '/sessions');
  });
});

describe('Session Create', () => {
  it('should create a new session', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.get('nav a[href="/sessions/create"]').click();
    cy.url().should('include', '/sessions/create');
    cy.contains('Create New Session');
    cy.get('input[name="name"]').type('Test create session');
    cy.get('input[name="date"]').type('2026-07-02');
    cy.get('select[name="teacherId"]').select('1');
    cy.get('textarea[name="description"]').type('test description');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
    cy.contains('Test create session');
  });
});

describe('Session Edit', () => {
  it('should edit a session', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.contains('h3', 'Test create session')
      .parents('div.bg-white')
      .find('a')
      .click();

    cy.contains('h1', 'Test create session');
    cy.contains('button', 'Edit').click();
    cy.url().should('include', '/sessions/edit');
    cy.get('input[name="name"]').clear().type('Test edit session');

    cy.get('textarea[name="description"]')
      .clear()
      .type('test edit description');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/sessions');
    cy.contains('h3', 'Test edit session');
  });
});

describe('Session Delete', () => {
  it('should delete a session', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.contains('h3', 'Test edit session')
      .parents('div.bg-white')
      .find('a')
      .click();
    cy.contains('h1', 'Test edit session');
    cy.contains('button', 'Delete').click();
    cy.url().should('include', '/sessions');
    cy.contains('h3', 'Test edit session').should('not.exist');
  });
});
