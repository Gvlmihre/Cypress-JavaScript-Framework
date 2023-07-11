

/// <reference types="cypress" />
import {
    getLocations,
    getRandomArrayElement
} from "../../../helpers/util";

require('cypress-xpath');
import faker from "faker";

describe('Run ConnectAppn Services Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    const airportIds = []
    let locationIds

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it("Co2nnectorpro V2 Public API Get Emission Units Test", () => {
        cy.apiRequest('GET', '/calculation-variables/units').then(json => {
            expect(json.status).to.equals(200)
        })
    })

    it('Co2nnectorpro V2 Public API Get Emission Units Filter By String Test', () => {
        const string = 'test'
        cy.apiRequest('GET', `/calculation-variables/units?search=${string}`)
            .then(json => {
                cy.get(json.body.content).each(item => {
                    expect(item.code.toLowerCase()).to.contain(`${string}`)
                })
            })
    })

    it('Co2nnectorpro V2 Public API Get Places Test', () => {
        cy.apiRequest('GET', '/calculation-variables/places?').then(json => {
            expect(json.status).to.equals(200)
        })
    })


    it('Co2nnectorpro V2 Public API Get Airports Test', () => {
        cy.apiRequest('GET', '/calculation-variables/places?placeType=AIRPORT')
            .then(json => {
                cy.get(json.body.content).each(item => {
                    airportIds.push(item.id)
                })
                cy.log(airportIds)
            })
    })


    it("Co2nnectorpro V2 Public API Calculate Airport Distance POST Request Test", () => {

        const departureAirportId = getRandomArrayElement(airportIds)
        const arrivalAirportId = getRandomArrayElement(airportIds)

        cy.apiRequest('POST', '/calculation-variables/calculate/airport-distance',
            {
                departureAirportId: departureAirportId,
                arrivalAirportId: arrivalAirportId
            }).then(json => {
                cy.log(json)
                const airportDistance = json.body.distance
                const departureAirport = json.body.departurePlace.name
                const arrivalAirport = json.body.arrivalPlace.name
                cy.log(airportDistance)
                cy.log(departureAirport)
                cy.log(arrivalAirport)
            })
    });

    it("Co2nnectorpro V2 Public API Delete Calculated Carbon Footprint Test ", () => {
        const emission_source_id = '32268b33-3afc-43d9-bbe3-9d56291462d6';
        const unit_id = '4d7f9150-3ac1-485b-86d2-84329e5d9b44';
        const amount = faker.mersenne.rand(1000, 1);
        const locationId = getRandomArrayElement(locationIds)
        let carbon_footprint_uuid;

        cy.apiRequest('POST', '/calculation/stationary',
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emission_source_id,
                unitId: unit_id
            }).then(json => {
                cy.log(json)
                expect(json.status).to.equals(200)

                carbon_footprint_uuid = json.body.id
                cy.log(carbon_footprint_uuid)

            }).then(() => {
                cy.apiRequest('DELETE', '/calculation/' + carbon_footprint_uuid)
            }).then(json => {
                expect(json.status).to.equals(204)
                expect(json.statusText).to.equals('No Content')
            })
    })
})

