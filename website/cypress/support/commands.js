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

Cypress.Commands.add('changeValue', (container, changedText) => {
    cy.visit('http://localhost:8080/admin/cms/')
    cy.contains(container).click()
    cy.get('textarea[name="newValue"]').clear().type(changedText)
    cy.get('button').click()
    cy.visit('http://localhost:8080/')
})

Cypress.Commands.add('resetField', (container) => {
    cy.fixture('../../src/models/cms-default-values.json').then((json) => {
        cy.changeValue(container, json[container])
    })
})
