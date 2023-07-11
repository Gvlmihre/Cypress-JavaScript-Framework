/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {
    getRandomArrayElement, getLocations, getAirportIds,
    calculateAirportDistance
} = require("../../../helpers/util");

describe('Run ConnectApp Public API Category 3.5 Business Travels Tests', () => {
    const username = `${Cypress.env('username')}`
    const password = `${Cypress.env('password')}`
    let locationIds
    const emissionSources = []
    const emissionSourceIds = []
    const emissionSourceUnits = []

    it("Co2nnectorpro V2 Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    //ConnectApp Public API Business Travels - Airway Tests Starts Here
    it('ConnectApp Public API Business Travels GET Calculated Carbon Footprints Test - Airway', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/business-travels/airway?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectAppalculate Carbon Footprint POST Request Test - Airway', () => {
        //get random location id from related location ids
        const locationId = getRandomArrayElement(locationIds)

        let departureAirportId
        let arrivalAirportId
        let distance
        let cabinClass

        //get airport ids and get random departure and arrival airport ids
        const airportIds = getAirportIds()
        cy.log(airportIds).then(() => {
            departureAirportId = getRandomArrayElement(airportIds)
            cy.log(departureAirportId)
            arrivalAirportId = getRandomArrayElement(airportIds)
            cy.log(arrivalAirportId)
        }).then(() => {

            //calculate airport distances to get the distance
            calculateAirportDistance(departureAirportId, arrivalAirportId).then(json => {
                distance = json.body.distance
                cy.log(distance)

                // define the cabinClass according to the distance
                if (distance <= 3700) {
                    cabinClass = getRandomArrayElement(['AVERAGE', 'ECONOMY', 'BUSINESS'])
                } else {
                    cabinClass = getRandomArrayElement(['AVERAGE', 'ECONOMY', 'BUSINESS', 'FIRST_CLASS', 'PREMIUM_ECONOMY'])
                }
                cy.log(cabinClass)

                //generate random passenger number
                const passengerCount = faker.mersenne.rand(500, 50)
                cy.log(passengerCount)

                // send Post request
                cy.apiRequest('POST',
                    `/calculation/business-travels/airway`,
                    {
                        locationId: locationId,
                        departurePlaceId: departureAirportId,
                        arrivalPlaceId: arrivalAirportId,
                        cabinClass: cabinClass,
                        distance: distance,
                        passengerCount: passengerCount
                    }).then(json => {
                        expect(json.status).to.equals(200)
                    })
            })
        })
    })

    //ConnectApp Public API Business Travels - Others Tests Starts Here
    it('ConnectApp Public API Business Travels GET Emission Sources Test - Others', () => {
        cy.apiRequest('GET', `/emission-source/business-travels?`)
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

    it('ConnectApp Public API Business Travels GET Emission Sources Filter By String Test - Others', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/business-travels?search=${string}`)
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    expect(item.name).to.contain(string)
                })
            })
    })

    it('ConnectApp Public API Business Travels GET Calculated Carbon Footprints Test- Others', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.apiRequest('GET', `/calculation/business-travels/others?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })


    it('ConnectApp Public API Business Travels Calculate Carbon Footprint POST Request Test - Others', () => {

        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(8, 1)

        cy.apiRequest('POST',
            `/calculation/business-travels/others`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
                unitId: emissionSourceUnits[i]
            }).then(json => {
                expect(json.status).to.equals(200)
            })
    })

    it('ConnectAppBusiness Travels Calculate Carbon Footprint POST Request 400 Bad Request Test - Others', () => {

        const locationId = getRandomArrayElement(locationIds)
        const amount = faker.mersenne.rand(1000, 1)
        const i = faker.mersenne.rand(8, 1)

        cy.apiRequest('POST',
            `/calculation/business-travels/others`,
            {
                locationId: locationId,
                amount: amount,
                emissionSourceId: emissionSourceIds[i],
            }).then(json => {
                expect(json.status).to.equals(400)
                expect(json.statusText).to.equals('Bad Request')
            })
    })
})

