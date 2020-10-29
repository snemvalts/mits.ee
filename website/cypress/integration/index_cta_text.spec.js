describe('Test index_cta_text', () => {
    it('Visit CMS and edit', () => {
        cy.visit('http://localhost:8080/admin/cms/')
        cy.contains('index_cta_text').click()
        cy.get('textarea').invoke('val').then((text) => {
            cy.get('textarea').clear().type(`
            <h1>Hello!</h1>
            <h2>Liitumine MITSi on avatud!</h2>
            <a class="btn gradient"
               href="/liitumine"
               target="_blank" rel="noopener">Liitu</a>
               `)
            cy.get('button').click()
            cy.visit('http://localhost:8080/')
            cy.get('#joininfo').should('contain', 'Hello!')
            cy.visit('http://localhost:8080/admin/cms/field/5f9878ee24dd5f00442d36be')
            cy.get('textarea').clear().type(text)
            cy.get('button').click()
        })
    })
})
