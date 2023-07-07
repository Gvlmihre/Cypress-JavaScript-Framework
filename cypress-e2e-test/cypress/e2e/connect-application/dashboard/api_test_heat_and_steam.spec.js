/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-05-03 16:15:53
 */

/// <reference types="cypress" />
require('cypress-xpath');
const loginPageElements = require("../../../fixtures/connectorprov2/dashboard/login_page.json");
const faker = require("faker");
const {getRandomArrayElement, getLocations} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 2 Heat and Steam Tests', () => {

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

    it('Connector Pro V2 Public API Heat and Steam GET Emission Sources Test', () => {

            cy.apiRequest('GET', `/emission-source/heat-and-steam?`)
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
        });


    it('Connector Pro V2 Public API Heat and Steam GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
            cy.apiRequest('GET', `/emission-source/heat-and-steam?search=${string}`)
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        expect(item.name).to.contain(string)
                    })
                })
        })
    
    it('Connector Pro V2 Public API Heat and Steam GET Calculated Carbon Footprints',() =>{
        const locationId = getRandomArrayElement(locationIds)
            cy.apiRequest('GET', `/calculation/heat-and-steam?locationId=${locationId}`)
                .then(json => {
                    expect(json.status).to.equals(200)
                })
        })


    it('Connector Pro V2 Public API Heat and Steam POST Calculate Carbon Footprint Test', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(3,1)

            cy.apiRequest('POST',
                `/calculation/heat-and-steam`,
                {
                    locationId: locationId,
                    amount: amount,
                    emissionSourceId: emissionSourceIds[i],
                    unitId: emissionSourceUnits[i]
                }).then(json => {
                expect(json.status).to.equals(200)
            })
        })


    it('Connector Pro V2 Public API Heat and Steam POST Calculate Carbon Footprint Test - 400 Bad Request', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(3,1)

            cy.apiRequest('POST',
                `/calculation/heat-and-steam`,
                {
                    locationId: locationId,
                    amount: amount,
                    emissionSourceId: emissionSourceIds[i]
                })
        })
    })
