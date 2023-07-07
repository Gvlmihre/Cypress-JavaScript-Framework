


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 4.2 Capital Goods Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnits = []
    const emissionUnitIds = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it("Co2nnectorpro V2 Public API Get Emission Units Test", () => {
        cy.apiRequest('GET', '/calculation-variables/units')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionUnitIds.push(item.id)
                })
                cy.log(emissionUnitIds)

            })
    })

    it('Connector Pro V2 Public API Capital Goods Create New Emission Source Post Request Test', () => {
        const reference = getRandomArrayElement(['Defra', 'Ecoinvent', 'EMA', 'EPA'])
        const emissionSourceName = faker.lorem.word()
        const unitId = getRandomArrayElement(emissionUnitIds)
        const co2EmissionFactor = faker.mersenne.rand(10, 1);

        cy.apiRequest('POST',
            `/emission-source/capital-goods`,
            {
                emissionSourceName: emissionSourceName,
                reference: reference,
                unitId: unitId,
                co2EmissionFactor: co2EmissionFactor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Capital Goods GET Emission Sources Test', () => {

        cy.apiRequest('GET', `/emission-source/capital-goods?`)
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

    it('Connector Pro V2 Public API Capital Goods GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)

        cy.apiRequest('GET', `/emission-source/capital-goods?search=${string}`)
            .then(json => {
                cy.log(json)
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('Connector Pro V2 Public API Capital Goods GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/capital-goods?locationId=${locationId}`).then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it('Connector Pro V2 Public API Capital Goods Calculate Carbon Footprint POST Request Test', () => {

        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(5, 1)

        cy.apiRequest('POST',
            `/calculation/capital-goods`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Capital Goods Calculate Carbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(8, 1)

        cy.apiRequest('POST',
            `/calculation/capital-goods`,
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