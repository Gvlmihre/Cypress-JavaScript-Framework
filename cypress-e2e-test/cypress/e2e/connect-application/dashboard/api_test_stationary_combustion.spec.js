
/// <reference types="cypress" />
require('cypress-xpath');
import {
    apiBadRequest,
    apiSuccessfulRequest,
    getLocations,
    getRandomArrayElement
} from '../../../helpers/util';
const faker = require("faker");


describe('Run ConnectApp Public API Category 1 Stationary Combustion Tests', () => {
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

    it('ConnectAppc API Stationary Combustion GET Emission Sources Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/emission-source/stationary?locationId=${locationId}`)
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
            })
    })

    it('ConnectApp Public API Stationary Combustion GET Emission Sources By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/emission-source/stationary?locationId=${locationId}&search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API Stationary Combustion GET Calculated Carbon Footprints Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/stationary?locationId=${locationId}`).then(json => {
            expect(json.status).to.equals(200)
        })
    })


    it('ConnectApp Public API Stationary Combustion POST Calculate Carbon Footprint Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(20, 1)

        cy.apiRequest('POST',
            `/calculation/stationary`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectAppion POST Calculate Carbon Footprint Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(20, 1)

        cy.apiRequest('POST',
            `/calculation/stationary`,
            {
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                locationId: locationId
            }).then(json => {
                expect(json.status).to.equals(400)
                expect(json.statusText).to.equals('Bad Request')
            })
    })
})
