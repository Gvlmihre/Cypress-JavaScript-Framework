/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-04-25 14:23:48
 */

/// <reference types="cypress" />
require('cypress-xpath');
const {apiForbiddenRequest} = require("../../../helpers/util");

describe('Run Connector Pro V2 Current User API Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`

    it("Co2nnectorpro V2 Public API Get Current User Test", () => {
        cy.apiRequest('GET', '/current-user')
        .then((json) => {
            expect(json.body.email).to.equals(username)
        })
    })


    it("Co2nnectorpro V2 Public API Current User GET request with an invalid Bearer Token", () => {
            apiForbiddenRequest('GET', `Bearer1 ${Cypress.env('token')}`, '/current-user')
        })
    })