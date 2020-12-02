describe('Test file upload function', () => {
    const fileLocation = '../fixtures/test-file.png';
    it('Upload file /meedia and check if exists', () => {
        cy.uploadFile('media', fileLocation);
        cy.deleteFile('media');
    })

    it('Upload file /meedia/liikmed and check if exists', () => {
        cy.uploadFile('media/liikmed', fileLocation);
        cy.deleteFile('media/liikmed');
    })

    it('Upload file media/sponsors and check if exists', () => {
        cy.uploadFile('media/sponsors', fileLocation);
        cy.deleteFile('media/sponsors');
    })

    it('Upload file media/icons and check if exists', () => {
        cy.uploadFile('media/icons', fileLocation);
        cy.deleteFile('media/icons');
    })

    it('Upload file twice and check if gives error', () => {
        cy.uploadFile('media', fileLocation);
        cy.uploadFile('media', fileLocation);
        cy.contains('Nimedega "media/test-file.png" failid on juba olemas.')
        cy.deleteFile('media');
    })
})
