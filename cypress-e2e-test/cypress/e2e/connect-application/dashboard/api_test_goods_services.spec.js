/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-06-01 13:06:45
 */


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {getRandomArrayElement, getLocations} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 4.1 Purchased Goods And Services Tests', () => {
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


    it('Connector Pro V2 Public API Purchased Goods And Services Create New Emission Source Post Request Test', () => {
        const reference = getRandomArrayElement(['Defra','Ecoinvent','EMA','EPA'])
        const emissionSourceName = faker.lorem.word()
        const unitId = getRandomArrayElement(emissionUnitIds)
        const co2EmissionFactor = faker.mersenne.rand(10, 0);
            cy.apiRequest('POST',
                `/emission-source/purchased-goods-and-services`,
                {
                    emissionSourceName: emissionSourceName,
                    reference: reference,
                    unitId: unitId,
                    co2EmissionFactor: co2EmissionFactor
                }).then(json => {
                    expect(json.status).to.equals(200)
            })
        })

    it('Connector Pro V2 Public API Purchased Goods And Services GET Emission Sources Test', () => {
                cy.apiRequest('GET', `/emission-source/purchased-goods-and-services?`)
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

    it('Connector Pro V2 Public API Purchased Goods And Services GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
            cy.apiRequest('GET', `/emission-source/purchased-goods-and-services?search=${string}`)
                .then(json => {
                    cy.log(json)
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        expect(item.name).to.contain(string)
                    })
                })
        })


    it('Connector Pro V2 Public API Purchased Goods And Services GET Calculated Carbon Footprints',() => {
        const locationId = getRandomArrayElement(locationIds)
            cy.apiRequest('GET', `/calculation/purchased-goods-and-services?locationId=${locationId}`)
        .then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it('Connector Pro V2 Public API Purchased Goods And Services Calculate Carbon Footprint POST Request Test', () =>{

        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(16,0)
        const co2EmissionFactor = faker.mersenne.rand(9,1)

            cy.apiRequest('POST',
                `/calculation/purchased-goods-and-services`,
                {
                    locationId: locationId,
                    amount: amount,
                    emissionSourceId: emissionSourceIds[i],
                    unitId: emissionSourceUnits[i],
                    co2EmissionFactor: co2EmissionFactor
                }).then(json => {
                expect(json.status).to.equals(200)
            })
        })

    it('Connector Pro V2 Public API Purchased Goods And Services Calculate Carbon Footprint POST Request Test - 400 Bad Request', () =>{
        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(8,1)

            cy.apiRequest('POST',
                `/calculation/purchased-goods-and-services`,
                {
                    locationId:locationId,
                    amount: amount,
                    emissionSourceId: emissionSourceIds[i]
                }).then(json => {
                expect(json.status).to.equals(400)
                expect(json.statusText).to.equals('Bad Request')
            })
        })
    })
