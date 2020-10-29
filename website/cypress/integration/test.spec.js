describe('Test index_cta_text', () => {
    it('Visit CMS and edit', () => {
        cy.visit('http://localhost:8080/admin/cms/field/5f9878ee24dd5f00442d36be')
        cy.get('textarea').should('contain', 'asdsa!')
    })
})
