/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-05-03 08:18:34
 */

/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {getRandomArrayElement, getLocations} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 1 Process Emissions tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const emissionUnitIds = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('Connector Pro V2 Public API Process Emissions GET Calculated Carbon Footprints Test', () => {
        const locationId = getRandomArrayElement(locationIds)
            cy.apiRequest('GET', `/calculation/process-emission?locationId=${locationId}`)
        .then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it("Co2nnectorpro V2 Public API Get Emission Unit Ids Test", () => {
            cy.apiRequest('GET', '/calculation-variables/units')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        emissionUnitIds.push(item.id)
                    })
                    cy.log(emissionUnitIds)
            })
        })


    it('Connector Pro V2 Public API Process Emissions POST Calculate Carbon Footprint Test', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const activity = faker.lorem.word()
        const amount = faker.mersenne.rand(1000, 1)
        const unit_id = getRandomArrayElement(emissionUnitIds)
        const co2_emission_factor = faker.mersenne.rand(10, 1)

            cy.apiRequest('POST',
                `/calculation/process-emission`,
                {
                    locationId: locationId,
                    activity: activity,
                    amount: amount,
                    unitId: unit_id,
                    co2EmissionFactor: co2_emission_factor
            }).then(json => {
                expect(json.status).to.equals(200)
            })
        })


    it('Connector Pro V2 Public API Process Emissions POST Calculate Carbon Footprint Test - 400 Bad Request', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const activity = faker.lorem.word()
        const amount = faker.mersenne.rand(1000, 1)
        const co2_emission_factor = faker.mersenne.rand(10, 1)

            cy.apiRequest('POST',
                `/calculation/process-emission`,
                {
                    locationId: locationId,
                    activity: activity,
                    amount: amount,
                    co2EmissionFactor: co2_emission_factor
            })
        })
    })
