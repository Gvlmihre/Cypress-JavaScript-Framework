
/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run ConnectApp Public API Category 4.5 Water Supply Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceNames = []
    const emissionSourceIds = []
    const emissionSourceUnitIds = []
    let locationIds

    it("ConnectApp Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('ConnectApp Public API Water Supply GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/water-supply?`)
            .then(json => {
                cy.get(json.body.content).each(item => {
                    expect(json.status).to.equals(200)
                    emissionSources.push(item)
                    emissionSourceNames.push(item.name)
                    emissionSourceIds.push(item.id)
                    emissionSourceUnitIds.push(item.units[0].id)
                })
            })
        cy.log(emissionSources)
        cy.log(emissionSourceNames)
        cy.log(emissionSourceIds)
        cy.log(emissionSourceUnitIds)
    })

    it('ConnectApp Public API Water Supply GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSourceNames)
        cy.apiRequest('GET', `/emission-source/water-supply?search=${string}`)
            .then(json => {
                cy.log(json)
                cy.get(json.body.content).each(item => {
                    expect(json.status).to.equals(200)
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API Water Supply GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/water-supply?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectApp Public API Water Supply Calculate Carbon Footprint POST Request Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(1, 0)
        const co2EmissionFactor = faker.mersenne.rand(9, 1)

        cy.apiRequest('POST',
            `/calculation/water-supply`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnitIds[i],
                co2EmissionFactor: co2EmissionFactor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectAppest - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(1, 0)

        cy.apiRequest('POST',
            `/calculation/water-supply`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i]
            }).then(json => {
                expect(json.status).to.equals(400);
                expect(json.statusText).to.equals('Bad Request')
            })
    })
})
