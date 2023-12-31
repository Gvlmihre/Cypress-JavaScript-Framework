

/// <reference types="cypress" />
require('cypress-xpath');
const { apiForbiddenRequest } = require("../../../helpers/util");

describe('Run ConnectApp Current User API Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`

    it("ConnectApp Public API Get Current User Test", () => {
        cy.apiRequest('GET', '/current-user')
            .then((json) => {
                expect(json.body.email).to.equals(username)
            })
    })


    it("ConnectApp Public API Current User GET request with an invalid Bearer Token", () => {
        apiForbiddenRequest('GET', `Bearer1 ${Cypress.env('token')}`, '/current-user')
    })
})
