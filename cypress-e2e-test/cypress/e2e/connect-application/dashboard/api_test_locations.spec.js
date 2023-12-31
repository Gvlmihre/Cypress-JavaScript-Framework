
/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");

describe('Run ConnectApp) => {
    const username = `${Cypress.env('username')}`
const password = `${Cypress.env('password')}`

it("ConnectApp Public API Get Locations Test", () => {
    cy.apiRequest('GET', '/locations').then(json => {
        expect(json.status).to.equals(200)
    })
})


it('ConnectApp Public API Get Locations By Year Test', () => {
    const year = faker.mersenne.rand(2021, 2025)
    cy.apiRequest('GET', `/locations?year=${year}`)
        .then(json => {
            cy.get(json.body.content).each(item => {
                expect(item.year).to.deep.eq(`${year}`)
            })
        })
})
})

