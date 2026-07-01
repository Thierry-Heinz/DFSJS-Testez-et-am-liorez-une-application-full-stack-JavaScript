describe('Sessions', () => {
  it('should view sessions', () => {
    cy.login();
    cy.visit('/sessions');
    cy.contains('Yoga Sessions');
  });

  it('should view sessions details', () => {
    cy.login();
    cy.visit('/sessions');
    cy.get('a[href="/sessions/2"]').click();
    cy.contains('Details');
    cy.contains('Back to Sessions');
  });

  it('should join sessions', () => {
    cy.login();
    cy.visit('/sessions/4');
    cy.contains('button', 'Join Sessions').click();
    cy.contains('strong', 'Participants');
    cy.contains('1');
  });
});
