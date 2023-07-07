/**
 * Climateware Copyright (c) 2023
 *
 * @summary ConnectorPro v2 public API tests using cypress
 * @author Gülmihre <gulimiremaimaiti@climateware.com>
 *
 * Created at     : 2023-05-17 10:06:45
 */


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {
    getRandomArrayElement,
    getLocations
} = require("../../../helpers/util");

describe('Run Connector Pro V2 Public API Category 3.1 Upstream Transportation And Distribution Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    let locationIds
    const emissionSources = []
    const emissionSourceIds = []

    const airEmissionSourceIds = []
    const airportIds = []

    const seaEmissionSourceIds = []
    const portIds = []

    const landEmissionSourceIds = []
    const landStationIds = []

    const railEmissionSourceIds = []

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources Test', () => {
            cy.apiRequest('GET', '/emission-source/upstream?').then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    emissionSources.push(item.name)
                    emissionSourceIds.push(item.id)
                })
                cy.log(emissionSources)
                cy.log(emissionSourceIds)
            })
        })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
            cy.apiRequest('GET', `/emission-source/upstream?search=${string}`).then(json => {
                expect(json.status).to.equals(200)
            })
        })

    //Upstream Transportation And Distribution - Air Related Tests Start Here
    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources - Air ', () => {

            cy.apiRequest('GET', '/emission-source/upstream?tripType=AIR')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        airEmissionSourceIds.push(item.id)
                    })
                    cy.log(airEmissionSourceIds)
            })
        })

    it('Co2nnectorpro V2 Public API Get Airport Ids Test', () => {
            cy.apiRequest('GET', '/calculation-variables/places?placeType=AIRPORT')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        airportIds.push(item.id)
                    })
                    cy.log(airportIds)
            })
        })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Air', () => {
        const locationId = getRandomArrayElement(locationIds)
        const airEmissionSourceId = getRandomArrayElement(airEmissionSourceIds)
        const weight = faker.mersenne.rand(3000, 1)
        const departurePlaceId = getRandomArrayElement(airportIds)
        const arrivalPlaceId = getRandomArrayElement(airportIds)
        let distance

            if (airEmissionSourceId === "4c830e99-d633-41c1-b15a-fcd8e34c8aab") {
                distance = faker.mersenne.rand(3699, 1)
            } else {
                distance = faker.mersenne.rand(9000, 3700)
            }
            cy.log(airEmissionSourceId)
            cy.log(distance)

            cy.apiRequest('POST', `/calculation/upstream?tripType=air`,
                {
                    locationId: locationId,
                    emissionSourceId: airEmissionSourceId,
                    distance: distance,
                    weight: weight,
                    departurePlaceId: departurePlaceId,
                    arrivalPlaceId: arrivalPlaceId
                }).then(json => {
                expect(json.status).to.equals(200)
                const calculatedAmount = json.amount
                cy.log(calculatedAmount)
            })
        })

    //Upstream Transportation And Distribution - Sea Related Tests Start Here
    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources - Sea ', () => {
            cy.apiRequest('GET', '/emission-source/upstream?tripType=SEA').then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    seaEmissionSourceIds.push(item.id)
                })
                cy.log(seaEmissionSourceIds)
            })
        })

    it('Co2nnectorpro V2 Public API Get port Ids Test', () => {
            cy.apiRequest('GET', '/calculation-variables/places?placeType=MARINE_PORT').then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    portIds.push(item.id)
                })
                cy.log(portIds)
            })
        })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Sea', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const seaEmissionSourceId = getRandomArrayElement(seaEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlaceId = getRandomArrayElement(portIds)
        const arrivalPlaceId = getRandomArrayElement(portIds)

            cy.apiRequest('POST',
                `/calculation/upstream?tripType=sea`,
                {
                    locationId: locationId,
                    distance: distance,
                    emissionSourceId: seaEmissionSourceId,
                    weight: weight,
                    departurePlaceId: departurePlaceId,
                    arrivalPlaceId: arrivalPlaceId
                }).then(json => {
                expect(json.status).to.equals(200)
                const calculatedAmount = json.body.amount
                cy.log(calculatedAmount)
            })
        })

    //Upstream Transportation And Distribution - Land Related Tests Start Here
    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources - Land ', () => {
            cy.apiRequest('GET', '/emission-source/upstream?tripType=LAND')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        landEmissionSourceIds.push(item.id)
                    })
                    cy.log(landEmissionSourceIds)
                })
        })

    it('Co2nnectorpro V2 Public API Get City Ids Test', () => {
            cy.apiRequest('GET', '/calculation-variables/places?placeType=CITY')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        landStationIds.push(item.id)
                    })
                    cy.log(landStationIds)
                })
        })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Land', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const landEmissionSourceId = getRandomArrayElement(landEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlaceId = getRandomArrayElement(landStationIds)
        const arrivalPlaceId = getRandomArrayElement(landStationIds)

            cy.apiRequest('POST',
                `/calculation/upstream?tripType=land`,
                {
                    locationId: locationId,
                    distance: distance,
                    emissionSourceId: landEmissionSourceId,
                    weight: weight,
                    departurePlaceId: departurePlaceId,
                    arrivalPlaceId: arrivalPlaceId
                }).then(json => {
                expect(json.status).to.equals(200)
                const calculatedAmount = json.body.amount
                cy.log(calculatedAmount)
            })
        })

    //Upstream Transportation And Distribution - Rail Related Tests Start Here
    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Emission Sources - Rail ', () => {
            cy.apiRequest('GET', '/emission-source/upstream?tripType=RAIL')
                .then(json => {
                    expect(json.status).to.equals(200)
                    cy.get(json.body.content).each(item => {
                        railEmissionSourceIds.push(item.id)
                    })
                    cy.log(railEmissionSourceIds)
                })
        })

    it('Connector Pro V2 Public API Upstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Rail', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const railEmissionSourceId = getRandomArrayElement(railEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlace = faker.address.cityName()
        const arrivalPlace = faker.address.cityName()

        cy.log(departurePlace)
        cy.log(arrivalPlace)

            cy.apiRequest('POST',
                `/calculation/upstream?tripType=rail`,
                {
                    locationId: locationId,
                    distance: distance,
                    emissionSourceId: railEmissionSourceId,
                    weight: weight,
                    departurePlace: departurePlace,
                    arrivalPlace: arrivalPlace
                }).then(json => {
                expect(json.status).to.equals(200)
                const calculatedAmount = json.body.amount
                cy.log(calculatedAmount)
            })
        })

    //Upstream Transportation And Distribution - Common Tests Start Here
    it('Connector Pro V2 Public API Upstream Transportation And Distribution GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.log(locationId)
            cy.apiRequest('GET', `/calculation/upstream?locationId=${locationId}`)
        .then(json => {
            expect(json.status).to.equals(200)
        })
    })
})