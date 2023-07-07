/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-06-07 10:18:32
 */


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {getRandomArrayElement, getLocations} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Indirect GHG Emissions From Other Sources Process Emissions 6.1 Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
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

    it('Connector Pro V2 Public API Indirect GHG Emissions From Other Sources 6.1 GET Calculated Carbon Footprints',() => {
        const locationId = getRandomArrayElement(locationIds)
            cy.apiRequest('GET', `/calculation/other-process-emission?locationId=${locationId}`)
        .then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it('Connector Pro V2 Public API Indirect GHG Emissions From Other Sources 6.1 Calculate Carbon Footprint POST Request Test', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const activity = faker.lorem.word()
        const amount = faker.mersenne.rand(1000, 1)
        const unitId = getRandomArrayElement(emissionUnitIds)
        const co2EmissionFactor = faker.mersenne.rand(9,1)

            cy.apiRequest('POST',
                `/calculation/other-process-emission`,
                {
                    locationId: locationId,
                    activity: activity,
                    amount: amount,
                    unitId: unitId,
                    co2EmissionFactor: co2EmissionFactor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
        })

    it('Connector Pro V2 Public API Indirect GHG Emissions From Other Sources 6.1 Calculate Carbon Footprint POST Request Test - 400 Bad Request', () =>{
        const activity = faker.lorem.word()
        const amount = faker.mersenne.rand(1000, 1)
        const unitId = getRandomArrayElement(emissionUnitIds)

            cy.apiRequest('POST',
                `/calculation/other-process-emission`,
                {
                    activity: activity,
                    amount: amount,
                    unitId: unitId
            }).then(json => {
                expect(json.status).to.equals(400);
                expect(json.statusText).to.equals('Bad Request')
            })
        })
    })
