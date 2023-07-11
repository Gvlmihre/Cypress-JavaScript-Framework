


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run ConnectApp Public API Category 3.3 Employee Commuting Tests', () => {
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

    it('ConnectApp Public API Employee Commuting GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/employee-commuting?`)
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


    it('ConnectApp Public API Employee Commuting GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/employee-commuting?search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })


    it('ConnectApp Public API Employee Commuting GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/employee-commuting?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectApp Public API Employee Commuting Calculate Carbon Footprint POST Request Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(7, 1)

        cy.apiRequest('POST',
            `/calculation/employee-commuting`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })


    it('ConnectApparbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(7, 1)

        cy.apiRequest('POST',
            `/calculation/employee-commuting`,
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
