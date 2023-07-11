import loginPageElements from "../../../fixtures/connectAppv2/dashboard/login_page.json";

/// <reference types="cypress" />
require('cypress-xpath');
import {
    clickOnElementAndVisitPageAndCheckUrl,
    clickDropDownMenuAndValidateOptions,
    logout,
    adminLogin,
} from '../../../helpers/util';



const connectAppCommonElements = require('../../../fixtures/connectAppv2/dashboard/common.json');
const resultsPageElements = require('../../../fixtures/connectAppv2/dashboard/results.json');

let languageStrings = 'tr';

// sanity check
expect(connectAppCommonElements, 'list of common items').to.be.an('array');
expect(resultsPageElements, 'list of results page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApps', () => {

    afterEach(() => {
        logout()
    });

    /**
     * Basic results' page tests start here
     */

    function loginAndVisitResultsPage() {
        adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
        clickOnElementAndVisitPageAndCheckUrl(connectAppCommonElements[3].sidebar[0].results[0], resultsPageElements[0].url);
    }

    it("Check reports page for all dropdown menus", () => {
        const dropdownMenuSelector = resultsPageElements[3].dropdown_menus;
        const years = dropdownMenuSelector[0].options[languageStrings]
        const locations = dropdownMenuSelector[2].options[languageStrings]
        const username1 = loginPageElements[0].admin_username
        const password1 = loginPageElements[1].password

        cy.request({
            method: 'POST',
            url: 'http://139.59.136.11:8000/auth/signin',
            //form : true,
            body: {
                username: username1,
                password: password1
            }
        }).then(results => {
            const token = results.body.accessToken
            cy.log(token)
            cy.log('setting bearer token ', token)
            const bearerToken = token;
            if (!token) return;
            loginAndVisitResultsPage();
            try {
                console.log('try token ', bearerToken)
                if (bearerToken === undefined) return;
                cy.request({
                    method: 'GET',
                    url: 'http://139.59.136.11:8000/company/c23a09fd-91de-4ed9-a0bd-3fe277ef0da0/years',
                    headers: {
                        Authorization: `Bearer ${bearerToken}`
                    }
                }).then(results => {
                    cy.log(results.body)
                    for (let i = 0; i < results.body.length; i++) {
                        years.push(results.body[i])
                    }
                    cy.log(years)
                }).then(
                    () => {
                        cy.request({
                            method: 'GET',
                            url: 'http://139.59.136.11:8000/company/c23a09fd-91de-4ed9-a0bd-3fe277ef0da0/location/simple?year=2021&page=0&size=999',
                            headers: {
                                Authorization: `Bearer ${bearerToken}`
                            }
                        }).then(results => {
                            cy.log(results.body.content)
                            for (let i = 0; i < results.body.content.length; i++) {
                                locations.push(results.body.content[i].name)
                            }
                            cy.log(locations)
                        })
                    }
                )
            } catch (e) {
                cy.log('e', e)
            }
        })
        cy.contains('#content > section > div.location-selection > div', 'Grup', { timeout: 3000 });
        cy.get(dropdownMenuSelector).each(ddMenuItem => {
            clickDropDownMenuAndValidateOptions(ddMenuItem, languageStrings);
        });

    })

    it("Check reports page for all buttons", () => {
        loginAndVisitResultsPage();
        cy.get(resultsPageElements[4].buttons[1][languageStrings]).each(item => {
            cy.contains(resultsPageElements[4].buttons[0].css, item);
        });
    });

    it("Check reports page for reports-panel's tab headers", () => {
        loginAndVisitResultsPage();
        cy.get(resultsPageElements[5].panel_tabs_content[1][languageStrings]).each(item => {
            cy.contains(resultsPageElements[5].panel_tabs_content[0].css, item);
        });
    });

    it("Check reports page for tab contents", () => {
        loginAndVisitResultsPage();
        cy.get(resultsPageElements[5].panel_tabs_content[2].tab_contents).each((item, index) => {
            if (index < 1) {
                cy.get(item[1].subcategories).each((el, index) => {
                    if (index < 2) {
                        cy.get(el.expanding_icon_css).click()
                        cy.get((item[1].subcategories[1])[languageStrings]).each(el1 => {
                            cy.contains(item[1].subcategories[index].css, el1)
                        })
                    } else {
                        cy.get(el.expanding_icon_css).click()
                        cy.get((item[1].subcategories[6])[languageStrings]).each(el1 => {
                            cy.contains(item[1].subcategories[index].css, el1)
                        })
                    }
                })
            } else {
                cy.get(item[0].css).click();
                if (item[1][languageStrings].length === 0) return false;//break if no options/headers available
                cy.get(item[1][languageStrings]).each(string => {
                    cy.contains(item[0].container_css, string);
                });
            }
        });


    })
})