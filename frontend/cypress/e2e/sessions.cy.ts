describe('Sessions', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );
  });

  it('should view sessions', () => {
    cy.login();
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.contains('Yoga Sessions');
  });

  it('should view Profile', () => {
    cy.login();
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('a[href="/profile"]').click();
    cy.url().should('include', '/profile');
    cy.contains('My Profile');
  });

  it('should view create session if admin (navbar link)', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('nav a[href="/sessions/create"]').click();
    cy.url().should('include', '/sessions/create');
    cy.contains('Create New Session');
  });

  it('should view create session if admin (button link)', () => {
    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('div.container a[href="/sessions/create"]').last().click();
    cy.contains('Create New Session');
  });

  it('should logout and view login', () => {
    cy.login();
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.contains('button', 'Logout').click();
    cy.url().should('include', '/login');
    cy.contains('Login to Yoga Studio');
  });
});

describe('Sessions Details', () => {
  it('should view session details', () => {
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');

    cy.login();
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('a[href^="/sessions/"]').first().click();
    cy.wait('@getSession');
    cy.contains('Details');
    cy.contains('Back to Sessions');
  });

  it('should join session', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');
    cy.intercept('POST', '/api/session/4/participate/*', {
      statusCode: 200,
    }).as('participate');

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');

    // Après le POST, le refetch doit refléter l'état "rejoint"
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-joined.json',
    }).as('getSessionAfterJoin');

    cy.contains('button', 'Join Session').click();
    cy.wait('@participate');
    cy.wait('@getSessionAfterJoin');

    cy.contains('button', 'Leave Session');
  });

  it('should leave session', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-joined.json',
    }).as('getSession');
    cy.intercept('DELETE', '/api/session/4/participate/*', {
      statusCode: 200,
    }).as('unparticipate');

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');

    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSessionAfterLeave');

    cy.contains('button', 'Leave Session').click();
    cy.wait('@unparticipate');
    cy.wait('@getSessionAfterLeave');

    cy.contains('Join Session');
  });

  it('should alert on participate failure', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');
    cy.intercept('POST', '/api/session/4/participate/*', {
      statusCode: 500,
    }).as('participateError');

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');

    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    cy.contains('button', 'Join Session').click();
    cy.wait('@participateError');
    cy.get('@alertStub').should(
      'have.been.calledWith',
      'Failed to join session',
    );
  });

  it('should alert on unparticipate failure', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-joined.json',
    }).as('getSession');
    cy.intercept('DELETE', '/api/session/4/participate/*', {
      statusCode: 500,
    }).as('unparticipateError');

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');

    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

    cy.contains('button', 'Leave Session').click();
    cy.wait('@unparticipateError');
    cy.get('@alertStub').should(
      'have.been.calledWith',
      'Failed to leave session',
    );
  });

  it('should go to session/edit if admin', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');

    cy.login('yoga@studio.com');
    cy.visit('/sessions/4');
    cy.wait('@getSession');
    cy.contains('button', 'Edit').click();
    cy.url().should('include', '/sessions/edit');
    cy.contains('Edit Session');
  });

  it('should go back to sessions (navbar)', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');
    cy.contains('button', 'Back to Sessions').click();
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');
  });

  it('should go back to sessions (button)', () => {
    cy.intercept('GET', '/api/session/4', {
      fixture: 'session-not-joined.json',
    }).as('getSession');
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );

    cy.login();
    cy.visit('/sessions/4');
    cy.wait('@getSession');
    cy.get('a[href="/sessions"]').click();
    cy.wait('@getSessions');
    cy.url().should('include', '/sessions');
  });
});

describe('Session Create', () => {
  it('should create a new session', () => {
    cy.intercept('GET', '/api/teacher', { fixture: 'teachers.json' }).as(
      'getTeachers',
    );
    cy.intercept('GET', '/api/session', { fixture: 'sessions-list.json' }).as(
      'getSessions',
    );
    cy.intercept('POST', '/api/session', {
      statusCode: 201,
      body: {
        id: 99,
        name: 'Test create session',
        date: '2026-07-02T00:00:00.000Z',
        description: 'test description',
        teacherId: 1,
        teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        users: [],
      },
    }).as('createSession');

    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.get('nav a[href="/sessions/create"]').click();
    cy.wait('@getTeachers');

    // La liste renvoyée après création inclut la nouvelle session
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 4,
          name: 'Yin Yoga',
          date: '2026-03-01T00:00:00.000Z',
          description: 'Une pratique relaxante et méditative...',
          teacherId: 3,
          teacher: { id: 3, firstName: 'David', lastName: 'Martin' },
          users: [],
        },
        {
          id: 99,
          name: 'Test create session',
          date: '2026-07-02T00:00:00.000Z',
          description: 'test description',
          teacherId: 1,
          teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
          users: [],
        },
      ],
    }).as('getSessionsAfterCreate');

    cy.get('input[name="name"]').type('Test create session');
    cy.get('input[name="date"]').type('2026-07-02');
    cy.get('select[name="teacherId"]').select('1');
    cy.get('textarea[name="description"]').type('test description');
    cy.get('button[type="submit"]').click();
    cy.wait('@createSession');
    cy.wait('@getSessionsAfterCreate');
    cy.url().should('include', '/sessions');
    cy.contains('Test create session');
  });
});

describe('Session Edit', () => {
  it('should edit a session', () => {
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 99,
          name: 'Test create session',
          date: '2026-07-02T00:00:00.000Z',
          description: 'test description',
          teacherId: 1,
          teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
          users: [],
        },
      ],
    }).as('getSessions');
    cy.intercept('GET', '/api/session/99', {
      body: {
        id: 99,
        name: 'Test create session',
        date: '2026-07-02T00:00:00.000Z',
        description: 'test description',
        teacherId: 1,
        teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        users: [],
      },
    }).as('getSession');
    cy.intercept('PUT', '/api/session/99', {
      statusCode: 200,
      body: {
        id: 99,
        name: 'Test edit session',
        date: '2026-07-02T00:00:00.000Z',
        description: 'test edit description',
        teacherId: 1,
        teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        users: [],
      },
    }).as('updateSession');

    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.contains('h3', 'Test create session')
      .parents('div.bg-white')
      .find('a')
      .click();
    cy.wait('@getSession');

    cy.contains('h1', 'Test create session');
    cy.contains('button', 'Edit').click();
    cy.url().should('include', '/sessions/edit');

    // Liste mise à jour après édition
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 99,
          name: 'Test edit session',
          date: '2026-07-02T00:00:00.000Z',
          description: 'test edit description',
          teacherId: 1,
          teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
          users: [],
        },
      ],
    }).as('getSessionsAfterEdit');

    cy.get('input[name="name"]').clear().type('Test edit session');
    cy.get('textarea[name="description"]')
      .clear()
      .type('test edit description');
    cy.get('button[type="submit"]').click();
    cy.wait('@updateSession');
    cy.wait('@getSessionsAfterEdit');
    cy.url().should('include', '/sessions');
    cy.contains('h3', 'Test edit session');
  });
});

describe('Session Delete', () => {
  it('should delete a session', () => {
    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 99,
          name: 'Test edit session',
          date: '2026-07-02T00:00:00.000Z',
          description: 'test edit description',
          teacherId: 1,
          teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
          users: [],
        },
      ],
    }).as('getSessions');
    cy.intercept('GET', '/api/session/99', {
      body: {
        id: 99,
        name: 'Test edit session',
        date: '2026-07-02T00:00:00.000Z',
        description: 'test edit description',
        teacherId: 1,
        teacher: { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        users: [],
      },
    }).as('getSession');
    cy.intercept('DELETE', '/api/session/99', { statusCode: 200 }).as(
      'deleteSession',
    );

    cy.login('yoga@studio.com');
    cy.visit('/sessions');
    cy.wait('@getSessions');
    cy.contains('h3', 'Test edit session')
      .parents('div.bg-white')
      .find('a')
      .click();
    cy.wait('@getSession');
    cy.contains('h1', 'Test edit session');

    // Liste vidée après suppression
    cy.intercept('GET', '/api/session', { body: [] }).as(
      'getSessionsAfterDelete',
    );

    cy.contains('button', 'Delete').click();
    cy.wait('@deleteSession');
    cy.wait('@getSessionsAfterDelete');
    cy.url().should('include', '/sessions');
    cy.contains('h3', 'Test edit session').should('not.exist');
  });
});
