import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

/// <reference types="cypress" />
require('cypress-xpath');
import {
    clickOnElementAndVisitPageAndCheckUrl,
    clickDropDownMenuAndValidateOptions,
    adminLogin,
    logout
} from '../../../helpers/util';
const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const analysisPageElements = require('../../../fixtures/connectorprov2/dashboard/analysis.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(analysisPageElements, 'list of analysis page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApp

    afterEach(() => {
    logout()
});

/**
 * Basic Analysis' page tests start here
 */

function loginAndVisitAnalysisPage() {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].analysis[0], analysisPageElements[0].url);
}

let dropdownMenus = analysisPageElements[3].dropdown_menus;
let years = dropdownMenus[0].options[languageStrings]
let locations = dropdownMenus[2].options[languageStrings]

it("Get years from analysis page years dropdown list ", () => {
    let year = []
    let newYear = []
    loginAndVisitAnalysisPage();
    cy.get('.v-select.header-year-select').click().wait(1000)
        .find('li').as('options')
        .then(options => [...options].map(option => option.innerText))
        .then(texts => year.push(texts.toString()));
    cy.log(year).then(() => {
        newYear = year[0].split(",")
        cy.log(newYear)
        cy.log(newYear.length)
        for (let i = 0; i < newYear.length; i++) {
            years.push(newYear[i])
        }
        cy.log(years)
        cy.log(years.length)
    })
})

it("Get locations from analysis page locations dropdown list ", () => {
    let location = []
    let newLocation = []
    loginAndVisitAnalysisPage();
    cy.get('.v-select.header-location-select').click().wait(1000)
        .find('li').as('options')
        .then(options => [...options].map(option => option.innerText))
        .then(texts => location.push(texts.toString()));
    cy.log(locations).then(() => {
        newLocation = location[0].split(",")
        cy.log(locations)
        cy.log(newLocation.length)
        for (let i = 0; i < newLocation.length; i++) {
            locations.push(newLocation[i])
        }
        cy.log(locations)
        cy.log(years.length)
    })
});

it("Check analysis page for all dropdown menus", () => {
    JSON.stringify(dropdownMenus);
    loginAndVisitAnalysisPage();
    cy.get(dropdownMenus).each(ddmenu => {
        clickDropDownMenuAndValidateOptions(ddmenu, languageStrings);
    });
});

it('Check analysis page for all left panel items', () => {
    loginAndVisitAnalysisPage();
    cy.get(analysisPageElements[4].left_panel_sections).each(item => {
        cy.get(item[0][languageStrings]).each(string => {
            cy.contains(item[0].css, string);
        });
    });
});

it("Check analysis page's right panel contents", () => {
    loginAndVisitAnalysisPage();
    cy.get(analysisPageElements[6].analysis_details_section.tab_contents[0].element_to_be_clicked).click()
    cy.get(analysisPageElements[5].right_panel_sections).each(item => {
        cy.get(item[languageStrings]).each(string => {
            cy.contains(item.css, string);
        });
    });
});
})

