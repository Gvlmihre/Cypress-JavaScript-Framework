


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run ConnectApp Public API End Of Life Stage Of Sold Products Category 5.3 Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceNames = []
    const emissionSourceIds = []
    let locationIds

    it("ConnectApp Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('ConnectApp Public API End Of Life Stage Of Sold Products 5.3 GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/end-of-life-stage?`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionSources.push(item)
                    emissionSourceNames.push(item.name)
                    emissionSourceIds.push(item.id)
                })
                cy.log(emissionSources)
                cy.log(emissionSourceIds)
                cy.log(emissionSourceNames)
            })
    })

    it('ConnectApp Public API End Of Life Stage Of Sold Products 5.3 GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSourceNames)
        cy.apiRequest('GET', `/emission-source/end-of-life-stage?search=${string}`)
            .then(json => {
                cy.log(json)
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API End Of Life Stage Of Sold Products 5.3 GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/end-of-life-stage?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectApp Public API End Of Life Stage Of Sold Products 5.3 Calculate Carbon Footprint POST Request Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(emissionSources.length - 1, 0)
        const co2EmissionFactor = faker.mersenne.rand(9, 1)
        const j = faker.mersenne.rand(emissionSources[i].disposalTypes.length - 1, 0)
        cy.apiRequest('POST',
            `/calculation/end-of-life-stage`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                disposalTypeId: emissionSources[i].disposalTypes[j].id,
                co2EmissionFactor: co2EmissionFactor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })


    it('ConnectAppStage Of Sold Products 5.3 Calculate Carbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(emissionSourceIds.length - 1, 1)

        cy.apiRequest('POST',
            `/calculation/end-of-life-stage`,
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
