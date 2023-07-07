

/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const { getRandomArrayElement, getLocations } = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 1 Fugitive Emissions tests', () => {

    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnits = []
    const deviceIds = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('Connector Pro V2 Public API Fugitive Emissions GET Emission Sources Test', () => {
        cy.apiRequest('GET', `/emission-source/fugitive-emission?`)
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


    it('Connector Pro V2 Public API Fugitive Emissions GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/fugitive-emission?search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('Connector Pro V2 Public API Fugitive Emissions GET Devices Test', () => {
        cy.apiRequest('GET', '/calculation-variables/fugitive-emission/devices?')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    deviceIds.push(item.id)
                })
                cy.log(deviceIds)
            })
    })

    it('Connector Pro V2 Public API Fugitive Emissions GET Data Sources Test', () => {

        cy.apiRequest('GET', '/calculation-variables/fugitive-emission/data-sources?')
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Fugitive Emissions GET Calculated Carbon Footprints Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/fugitive-emission?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Fugitive Emissions POST Calculate Carbon Footprint Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const deviceId = getRandomArrayElement(deviceIds)
        const i = faker.mersenne.rand(20, 1)
        const fill_amount = faker.mersenne.rand(1000, 1)
        const gas_capacity = faker.mersenne.rand(100, 2)

        cy.apiRequest('POST',
            `/calculation/fugitive-emission`,
            {
                locationId: locationId,
                deviceId: deviceId,
                emissionSourceId: emissionSourceIds[i],
                fillAmount: fill_amount,
                gasCapacity: gas_capacity,
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('Connector Pro V2 Public API Fugitive Emissions POST Calculate Carbon Footprint Test - 400 Bad Request', () => {
        const device_id = getRandomArrayElement(deviceIds)
        const i = faker.mersenne.rand(20, 1)
        const fill_amount = faker.mersenne.rand(1000, 1)
        const gas_capacity = faker.mersenne.rand(100, 2)

        cy.apiRequest('POST',
            `/calculation/fugitive-emission`,
            {
                deviceId: device_id,
                emissionSourceId: emissionSourceIds[i],
                fillAmount: fill_amount,
                gasCapacity: gas_capacity
            }).then(json => {
                expect(json.status).to.equals(400)
                expect(json.statusText).to.equals('Bad Request')
            })
    })
})