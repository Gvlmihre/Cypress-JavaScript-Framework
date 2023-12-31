


/// <reference types="cypress" />
require('cypress-xpath');
const faker = require("faker");
const {
    getRandomArrayElement,
    getLocations
} = require("../../../helpers/util");

describe('Run ConnectAppc API Category 3.1 downstream Transportation And Distribution Tests', () => {
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

    it("ConnectApp Public API Get Location Ids Test", () => {
        locationIds = getLocations()
        cy.log(locationIds)
    })

    it('ConnectApp Public API Downstream Transportation And Distribution GET Emission Sources Test', () => {
        cy.apiRequest('GET', '/emission-source/downstream?').then(json => {
            expect(json.status).to.equals(200)
            cy.get(json.body.content).each(item => {
                emissionSources.push(item.name)
                emissionSourceIds.push(item.id)
            })
            cy.log(emissionSources)
            cy.log(emissionSourceIds)
        })
    })

    it('ConnectApp Public API Downstream Transportation And Distribution GET Emission Sources Filter By String Test', () => {
        const string = getRandomArrayElement(emissionSources)
        cy.apiRequest('GET', `/emission-source/downstream?search=${string}`).then(json => {
            expect(json.status).to.equals(200)
        })
    })

    //Downstream Transportation And Distribution - Air Related Tests Start Here
    it('ConnectApp Public API Downstream Transportation And Distribution GET Emission Sources - Air ', () => {

        cy.apiRequest('GET', '/emission-source/downstream?tripType=AIR')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    airEmissionSourceIds.push(item.id)
                })
                cy.log(airEmissionSourceIds)
            })
    })


    it('ConnectApp Public API Get Airport Ids Test', () => {
        cy.apiRequest('GET', '/calculation-variables/places?placeType=AIRPORT')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    airportIds.push(item.id)
                })
                cy.log(airportIds)
            })
    })

    it('ConnectAppc API Downstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Air', () => {
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

        cy.apiRequest('POST', `/calculation/downstream?tripType=air`,
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


    //Downstream Transportation And Distribution - Sea Related Tests Start Here
    it('ConnectApp Public API Downstream Transportation And Distribution GET Emission Sources - Sea ', () => {
        cy.apiRequest('GET', '/emission-source/downstream?tripType=SEA').then(json => {
            expect(json.status).to.equals(200)
            cy.get(json.body.content).each(item => {
                seaEmissionSourceIds.push(item.id)
            })
            cy.log(seaEmissionSourceIds)
        })
    })

    it('ConnectApp Public API Get port Ids Test', () => {
        cy.apiRequest('GET', '/calculation-variables/places?placeType=MARINE_PORT').then(json => {
            expect(json.status).to.equals(200)
            cy.get(json.body.content).each(item => {
                portIds.push(item.id)
            })
            cy.log(portIds)
        })
    })

    it('ConnectApp Public API Downstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Sea', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const seaEmissionSourceId = getRandomArrayElement(seaEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlaceId = getRandomArrayElement(portIds)
        const arrivalPlaceId = getRandomArrayElement(portIds)

        cy.apiRequest('POST',
            `/calculation/downstream?tripType=sea`,
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

    //Downstream Transportation And Distribution - Land Related Tests Start Here
    it('ConnectApp Public API downstream Transportation And Distribution GET Emission Sources - Land ', () => {
        cy.apiRequest('GET', '/emission-source/downstream?tripType=LAND')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    landEmissionSourceIds.push(item.id)
                })
                cy.log(landEmissionSourceIds)
            })
    })


    it('ConnectApp Public API Get City Ids Test', () => {
        cy.apiRequest('GET', '/calculation-variables/places?placeType=CITY')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    landStationIds.push(item.id)
                })
                cy.log(landStationIds)
            })
    })


    it('ConnectApp Public API Downstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Land', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const landEmissionSourceId = getRandomArrayElement(landEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlaceId = getRandomArrayElement(landStationIds)
        const arrivalPlaceId = getRandomArrayElement(landStationIds)

        cy.apiRequest('POST',
            `/calculation/downstream?tripType=land`,
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


    //Downstream Transportation And Distribution - Rail Related Tests Start Here
    it('ConnectApp Public API Downstream Transportation And Distribution GET Emission Sources - Rail ', () => {
        cy.apiRequest('GET', '/emission-source/downstream?tripType=RAIL')
            .then(json => {
                expect(json.status).to.equals(200)
                cy.get(json.body.content).each(item => {
                    railEmissionSourceIds.push(item.id)
                })
                cy.log(railEmissionSourceIds)
            })
    })

    it('ConnectApp Public API Downstream Transportation And Distribution Calculate Carbon Footprint POST Request Test - Rail', () => {

        const locationId = getRandomArrayElement(locationIds)
        const distance = faker.mersenne.rand(9000, 1)
        const railEmissionSourceId = getRandomArrayElement(railEmissionSourceIds)
        const weight = faker.mersenne.rand(7000, 500)
        const departurePlace = faker.address.cityName()
        const arrivalPlace = faker.address.cityName()

        cy.log(departurePlace)
        cy.log(arrivalPlace)

        cy.apiRequest('POST',
            `/calculation/downstream?tripType=rail`,
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

    //Downstream Transportation And Distribution - Common Tests Start Here
    it('ConnectAppDistribution GET Calculated Carbon Footprints', () => {
        const locationId = getRandomArrayElement(locationIds)
        cy.log(locationId)
        cy.apiRequest('GET', `/calculation/downstream?locationId=${locationId}`)
            .then(json => {
                expect(json.status).to.equals(200)
            })
    })
})
