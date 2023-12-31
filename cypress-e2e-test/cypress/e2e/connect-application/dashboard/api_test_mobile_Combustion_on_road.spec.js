
/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
import {
    getLocations,
    getRandomArrayElement
} from '../../../helpers/util';
describe('Run ConnectApp Public API Category 1 Mobile Combustion On Road tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnits = []
    let locationIds

    it("ConnectApp Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('ConnectApp Public API Mobile Combustion On Road GET Emission Sources test', () => {
        cy.apiRequest('GET', `/emission-source/mobile-combustion/on-road?`)
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


    it('ConnectApp Public API Mobile Combustion On Road GET Emission Sources By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/mobile-combustion/on-road?search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API Mobile Combustion On Road GET Calculated Carbon Footprints test', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/mobile-combustion/on-road?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })


    it('ConnectApp Public API Mobile Combustion On Road POST Calculate Carbon Footprint', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(10, 1)
        cy.apiRequest('POST',
            `/calculation/mobile-combustion/on-road`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })


    it('ConnectApp Combustion On Road POST Calculate Carbon Footprint Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(20, 1)
        cy.apiRequest('POST',
            `/calculation/mobile-combustion/on-road`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
            }).then(json => {
                expect(json.status).to.equals(400)
            })
    })
})
