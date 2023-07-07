


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 3.4 Client And Visitor Transportation Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnits = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('Connector Pro V2 Public API Client And Visitor Transportation GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/client?`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionSources.push(item.name)
                    emissionSourceIds.push(item.id)
                    emissionSourceUnits.push(item.units[0].id)
                })
                cy.log(emissionSources)
                cy.log(emissionSourceIds)
                cy.log(emissionSourceUnits)
            });
    })

    it('Connector Pro V2 Public API Client And Visitor Transportation GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/client?search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('Connector Pro V2 Public API Client And Visitor Transportation GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/client?locationId=${locationId}`).then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it('Connector Pro V2 Public API Client And Visitor Transportation Calculate Carbon Footprint POST Request Test', () => {

        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(7, 1)

        cy.apiRequest('POST',
            `/calculation/client`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Client And Visitor Transportation Calculate Carbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(8, 1)

        cy.apiRequest('POST',
            `/calculation/client`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i]
            }).then(json => {
                expect(json.status).to.equals(400)
                expect(json.statusText).to.equals('Bad Request')
            })
    })
})