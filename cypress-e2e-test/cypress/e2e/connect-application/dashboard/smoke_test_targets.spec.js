import loginPageElements from "../../../fixtures/connectAppv2/dashboard/login_page.json";

/// <reference types="cypress" />
require('cypress-xpath');
import {
    logout,
    adminLogin,
    clickOnElementAndVisitPageAndCheckUrl,
} from '../../../helpers/util';

const connectAppCommonElements = require('../../../fixtures/connectAppv2/dashboard/common.json');
const targetsPageElements = require('../../../fixtures/connectAppv2/dashboard/targets.json');
let languageStrings = 'tr';

// sanity check
expect(connectAppCommonElements, 'list of common items').to.be.an('array');
expect(targetsPageElements, 'list of targets page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApp

    afterEach(() => {
    logout()
});

/**
 * Basic targets' page tests start here
 */

function loginAndVisitTargetsPage() {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    clickOnElementAndVisitPageAndCheckUrl(connectAppCommonElements[3].sidebar[0].targets[0], targetsPageElements[0].url);
}

it('Check targets page for title and description', () => {
    loginAndVisitTargetsPage();
    cy.contains(targetsPageElements[1].title[0].css, targetsPageElements[1].title[0][languageStrings]);
    cy.contains(targetsPageElements[2].description[0].css, targetsPageElements[2].description[0][languageStrings]);
});

it("Check targets page's targets table headers", () => {
    loginAndVisitTargetsPage();
    cy.get(targetsPageElements[3].table_headers_targets[1].target_type_tables).each(item => {
        cy.get(item.button_css).click()
        cy.get(item[languageStrings]).each(elem => {
            cy.contains(targetsPageElements[3].table_headers_targets[0].css, elem);
        })

    });
});

it("Check targets page's emission source buttons", () => {
    loginAndVisitTargetsPage();
    //check the select action buttons
    cy.get(targetsPageElements[4].emission_source_section[0].select_action_buttons[0][languageStrings]).each(item => {
        cy.contains(targetsPageElements[4].emission_source_section[0].select_action_buttons[0].css, item);
    })

    //check the emission source buttons
    cy.get(targetsPageElements[4].emission_source_section[1].emission_sources[1].category_buttons).each(item => {
        cy.get(item[languageStrings]).each(elem => {
            cy.contains(targetsPageElements[4].emission_source_section[1].emission_sources[0].css, elem);
        })
    })

    //check the emission action buttons
    cy.get(targetsPageElements[4].emission_source_section[2].emission_action_buttons[0][languageStrings]).each(item => {
        cy.contains(targetsPageElements[4].emission_source_section[2].emission_action_buttons[0].css, item);
    })
});

it("Check targets page's my location targets table", () => {
    loginAndVisitTargetsPage();
    cy.get(targetsPageElements[5].my_location_targets_table[0].css).click()
    cy.get(targetsPageElements[5].my_location_targets_table[1][languageStrings]).each(item => {
        cy.contains(targetsPageElements[5].my_location_targets_table[1].css, item)
    })
})

it("Check targets page's my company targets table", () => {
    loginAndVisitTargetsPage();
    cy.get(targetsPageElements[6].my_company_targets_table[0].css).click()
    cy.get(targetsPageElements[6].my_company_targets_table[1][languageStrings]).each(item => {
        cy.contains(targetsPageElements[6].my_company_targets_table[1].css, item)
    })
})

})


