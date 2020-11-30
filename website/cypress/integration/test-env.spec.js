describe('Test test enviroment', () => {
    it('Change text and check if correct', () => {
        const selectAllKeyCombo = Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a';

        cy.visit('http://localhost:8080/admin/cms/')
        cy.wait(2000);
        cy.get('#index_cta_text').click()
        cy.wait(1000)
        cy.get('#html-editor')
            .click()
            .focused()
            .type(selectAllKeyCombo)
            .type(`
            <h1>Hello!</h1
            <h2>Liitumine MITSi on avatud!</h2>
            <a class="btn gradient" href="/liitumine" target="_blank" rel="noopener">Liitu</a>
            `)
        cy.get('#test-button').click()
        cy.wait(1000)
        cy.get('iframe').then(($iframe) => {
            const $body = $iframe.contents().find('body')
            cy.wrap($body).find('#joininfo').should('contain', 'Hello!')
        })
    })
})
