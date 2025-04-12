describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the home page', () => {
    cy.get('h1').should('exist')
  })
}) 