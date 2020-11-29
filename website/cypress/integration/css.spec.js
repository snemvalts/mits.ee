describe('Test CSS editing', () => {
    it('Test CSS', () => {
        const selectAllKeyCombo = Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a';
        cy.visit('http://localhost:8080/admin/cms/')
        cy.wait(2000)
        cy.get('#index_cta_text').click()
        cy.get('#css').click()
        cy.wait(2000)
        cy.get('#css-editor')
            .click()
            .focused()
            .type(selectAllKeyCombo)
            .type(`
            h1 {
                color: red;`)

        cy.get('#save-button').click()
        cy.visit('http://localhost:8080/')

        cy.contains('h1', 'Hei!').should('have.css', 'color', 'rgb(255, 0, 0)')

        cy.visit('http://localhost:8080/admin/cms/')
        cy.wait(2000);
        cy.get('#index_cta_text').click()
        cy.get('#css').click()
        cy.wait(2000)
        cy.get('#css-editor')
            .click()
            .focused()
            .type(selectAllKeyCombo)
            .type('/* Add custom SCSS */')
        cy.get('#save-button').click()
        cy.visit('http://localhost:8080/')
    })
})
