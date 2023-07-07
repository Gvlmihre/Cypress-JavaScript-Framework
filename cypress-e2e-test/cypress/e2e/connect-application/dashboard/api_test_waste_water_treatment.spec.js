/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-06-05 09:43:34
 */


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {getRandomArrayElement, getLocations} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 4.4 Waste Water Treatment Tests', () => {

    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionSources = []
    const emissionSourceNames = []
    const emissionSourceIds = []
    const emissionSourceUnitIds = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('Connector Pro V2 Public API Waste Water Treatment GET Emission Sources Test', () => {
            cy.apiRequest('GET', `/emission-source/waste-water-treatment?`)
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
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

    it('Connector Pro V2 Public API Waste Water Treatment GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSourceNames)
            cy.apiRequest('GET', `/emission-source/waste-water-treatment?search=${string}`)
                .then(json => {
                    cy.log(json)
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        expect(item.name).to.contain(string)
                    })
                })
        })

    it('Connector Pro V2 Public API Waste Water Treatment GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
            cy.apiRequest('GET', `/calculation/waste-water-treatment?locationId=${locationId}`)
                .then(json => {
                    expect(json.status).to.equals(200)
            })
        })

    it('Connector Pro V2 Public API Waste Water Treatment Calculate Carbon Footprint POST Request Test', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(1,0)
        const co2EmissionFactor = faker.mersenne.rand(9,1)

            cy.apiRequest('POST',
                `/calculation/waste-water-treatment`,
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

    it('Connector Pro V2 Public API Waste Water Treatment Calculate Carbon Footprint POST Request Test - 400 Bad Request', () => {
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(1,0)

            cy.apiRequest('POST',
                `/calculation/waste-water-treatment`,
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