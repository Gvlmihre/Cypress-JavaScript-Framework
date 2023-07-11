
/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run ConnectApp Public API Usage Phase Of Sold Products Category 5.2 Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnitIds = []
    const emissionUnitIds = []
    let locationIds

    it("ConnectApp Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it("ConnectApp Public API Get Emission Units Test", () => {
        cy.apiRequest('GET', '/calculation-variables/units')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionUnitIds.push(item.id)
                })
                cy.log(emissionUnitIds)
            })
    })

    it('ConnectApp Public API Usage Phase Of Sold Products 5.2 Create New Emission Source POST Request Test', () => {
        const reference = getRandomArrayElement(['Defra', 'Ecoinvent', 'EMA', 'EPA'])
        const emissionSourceName = faker.lorem.word()
        const unitId = getRandomArrayElement(emissionUnitIds)
        const co2EmissionFactor = faker.mersenne.rand(10, 1);
        cy.apiRequest('POST',
            `/emission-source/usage-stage`,
            {
                emissionSourceName: emissionSourceName,
                reference: reference,
                unitId: unitId,
                co2EmissionFactor: co2EmissionFactor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectApp Public API Usage Phase Of Sold Products 5.2 GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/usage-stage?`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionSources.push(item.name)
                    emissionSourceIds.push(item.id)
                    emissionSourceUnitIds.push(item.units[0].id)
                })
                cy.log(emissionSources)
                cy.log(emissionSourceIds)
                cy.log(emissionSourceUnitIds)
            })
    })

    it('ConnectApp Public API Usage Phase Of Sold Products 5.2 GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/usage-stage?search=${string}`)
            .then(json => {
                cy.log(json)
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API Usage Phase Of Sold Products 5.2 GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/usage-stage?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectApp Public API Usage Phase Of Sold Products 5.2 Calculate Carbon Footprint POST Request Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(emissionSourceIds.length - 1, 0)
        const co2EmissionFactor = faker.mersenne.rand(9, 1)

        cy.apiRequest('POST',
            `/calculation/usage-stage`,
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

    it('ConnectAppPhase Of Sold Products 5.2 Calculate Carbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(emissionSourceIds.length - 1, 1)

        cy.apiRequest('POST',
            `/calculation/usage-stage`,
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
