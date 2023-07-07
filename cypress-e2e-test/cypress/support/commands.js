// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const {createFolderIfNotExists, apiSuccessfulRequest} = require("../helpers/util");

/*Cypress.Commands.add("LoginAPI", (username, password) => {
    cy.api({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}${Cypress.env('loginEndPoint')}`,
        failOnStatusCode: false,
        body: {
            username: username,
            password: password
        }
    }).then((response) => {
        cy.log(response)
        Cypress.env('token', response.body.accessToken);
        Cypress.env('refreshToken', response.body.refreshToken);
        cy.log(Cypress.env('token'))
        cy.log(Cypress.env('refreshToken'))

        createFolderIfNotExists('cypress/fixtures/generated_json_files')
            .then((path) => {
                console.log(`Successfully created directory: '${path}'`);
            }).catch((error) => {
            console.log(`Problem creating directory: ${error.message}`)
        });

        cy.writeFile('cypress/fixtures/generated_json_files/loginWriteFile.json', response)
    })
    return cy.readFile('cypress/fixtures/generated_json_files/loginWriteFile.json')
})*/

Cypress.Commands.add("apiRequest", (apiMethod, urlEndpoint, requestBody) => {
    cy.api(
        {
            method: apiMethod,
            url: `${Cypress.env('apiBaseUrl')}` + urlEndpoint,
            failOnStatusCode: false,
            headers: {
                'API-Key': `${Cypress.env('token')}`
            },
            body: requestBody
        }).then(results => {
        cy.log(results)
        const responseCode = results.status
        const statusText = results.statusText
        cy.log(responseCode)
        cy.log(statusText)
        if (responseCode === 200) {
            cy.log('Successful request with 200 status code')
           /* expect(responseCode).to.deep.eq(200)
            expect(statusText).to.deep.eq('OK')*/
        }

        if (responseCode === 204) {
            cy.log('Delete request with 204 status code')
           /* expect(responseCode).to.deep.eq(204)
            expect(statusText).to.deep.eq('No Content')*/
        }

        if (responseCode === 400) {
            cy.log('Bad request with 400 status code')
           /* expect(responseCode).to.deep.eq(400)
            expect(statusText).to.deep.eq('Bad Request')*/
        }

        if(responseCode === 403) {
            cy.log('Forbidden with 403 status code')
           /* expect(responseCode).to.deep.eq(403)
            expect(statusText).to.deep.eq('Forbidden')*/
        }

        if(responseCode === 500) {
            cy.log('Internal Server Error with 500 status code')
           /* expect(responseCode).to.deep.eq(500)
            expect(statusText).to.deep.eq('Internal Server Error')*/
        }


        createFolderIfNotExists('cypress/fixtures/generated_json_files')
            .then((path) => {
                console.log(`Successfully created directory: '${path}'`);
            }).catch((error) => {
            console.log(`Problem creating directory: ${error.message}`)
        });
        cy.writeFile('cypress/fixtures/generated_json_files/writeFileSuccess.json', results)
    })
    return cy.readFile('cypress/fixtures/generated_json_files/writeFileSuccess.json')
})

