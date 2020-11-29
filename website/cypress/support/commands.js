// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-file-upload';

Cypress.Commands.add('changeValue', (container, changedText) => {
    const selectAllKeyCombo = Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a';

    cy.visit('http://localhost:8080/admin/cms/')
    cy.wait(2000);
    cy.get(`#${container}`).click()
    cy.get('#html-editor')
        .click()
        .focused()
        .type(selectAllKeyCombo)
        .type(changedText)
    cy.get('#save-button').click()
    cy.visit('http://localhost:8080/')
})

Cypress.Commands.add('resetField', (container) => {
    cy.fixture('../../src/models/cms-default-values.json').then((json) => {
        cy.changeValue(container, json[container])
    })
})

Cypress.Commands.add('uploadFile', (path, fileLocation) => {
    cy.visit('http://localhost:8080/admin/cms/');
    cy.wait(1000);
    cy.get('#folder').select(path);
    cy.get('input[type=file]').attachFile(fileLocation);
    cy.get('input[type=submit]').click();
    cy.readFile(`src/public/${path}/test-file.png`).should('exist');
})

Cypress.Commands.add('deleteFile', (path) => {
    cy.exec(`rm src/public/${path}/test-file.png`);
    cy.readFile(path).should('not.exist');
})
