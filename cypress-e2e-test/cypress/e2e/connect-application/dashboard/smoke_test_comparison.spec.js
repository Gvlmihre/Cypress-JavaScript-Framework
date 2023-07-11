import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

/// <reference types="cypress" />
require('cypress-xpath');
import {
    adminLogin,
    logout,
    clickOnElementAndVisitPageAndCheckUrl
} from '../../../helpers/util';
const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const comparisonsPageElements = require('../../../fixtures/connectorprov2/dashboard/comparison.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(comparisonsPageElements, 'list of comparisons page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApp> {
    afterEach(() => {
    logout()
});

/**
 * Basic comparisons' page tests start here
 */

function loginAndVisitComparisonPage() {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].comparison[0], comparisonsPageElements[0].url);
    cy.visit('/comparison');
}

it('Check comparisons page for title and description', () => {
    loginAndVisitComparisonPage();
    cy.contains(comparisonsPageElements[1].title[0].css, comparisonsPageElements[1].title[0][languageStrings]);
    cy.contains(comparisonsPageElements[2].description[0].css, comparisonsPageElements[2].description[0][languageStrings]);
});

it("Check comparisons page's comparison buttons", () => {
    loginAndVisitComparisonPage();
    cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[2][languageStrings]).each(item => {
        cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[0].css, item);
    });
});

it("Check comparisons page's comparison contents tab", () => {
    loginAndVisitComparisonPage();

    //check the locations and location groups
    cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[1].content).each(item => {
        cy.get(item[0].css).click();
        cy.get(item[1].options[languageStrings]).each(string => {
            cy.contains(item[1].css, string);

            //check the select all and clear selection buttons
            cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[1].select_action_buttons[0][languageStrings]).each(element => {
                cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[1].select_action_buttons[0].css, element);
            });

            //check the calculation type dropdown menu
            cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[2].calculation_type_ddmenu[0][languageStrings]).each(el => {
                cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[2].calculation_type_ddmenu[0].css, el);
            });

            //check all the category buttons
            cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[3].category_buttons).each(elem => {
                cy.get(elem[languageStrings]).each(text => {
                    cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[0].css, text)
                })
            })

            //check the compare button
            cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[4].compare_button[0][languageStrings]).each(i => {
                cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[3].comparison_tab_contents[2].Emission_source_tabs[4].compare_button[0].css, i);
            });

        });
    });
});

it('Check comparison result section buttons in comparison page', () => {
    loginAndVisitComparisonPage();
    cy.get(comparisonsPageElements[3].panel_comparisons_tab_contents[4].comparison_result_section[0][languageStrings]).each(item => {
        cy.contains(comparisonsPageElements[3].panel_comparisons_tab_contents[4].comparison_result_section[0].css, item);
    });
});

it('Check year ddmenu in comparison page', () => {
    loginAndVisitComparisonPage();
    const year_ddmenu = comparisonsPageElements[3].panel_comparisons_tab_contents[1].comparison_year_ddmenu
    const years_in_ddmenu = comparisonsPageElements[3].panel_comparisons_tab_contents[1].comparison_year_ddmenu[0][languageStrings]
    cy.get(year_ddmenu[0].css).find('option').each(item => {
        cy.get(item).invoke('val').then((text) => {
            years_in_ddmenu.push(text)
            cy.log(years_in_ddmenu)

            cy.get(year_ddmenu[0][languageStrings]).each(item => {
                cy.contains(year_ddmenu[0].css, item);
            });
        })
    })
})
})