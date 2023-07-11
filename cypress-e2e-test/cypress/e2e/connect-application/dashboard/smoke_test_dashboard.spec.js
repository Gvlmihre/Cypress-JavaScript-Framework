

/// <reference types="cypress" />
require('cypress-xpath');
import {
    adminLogin,
    logout
} from '../../../helpers/util';

import dashboardLandingPageElements from "../../../fixtures/connectorprov2/dashboard/dashboard.json";
import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json"
import connectorProTRLanguageCode from "../../../helpers/util.js"
import connectorProENLanguageCode from "../../../helpers/util.js"


let languageStrings = 'tr';

expect(loginPageElements, 'list of login page items').to.be.an('array');
expect(dashboardLandingPageElements, 'list of dashboard page items').to.be.an('array');

/**
 * More description
 */
describe('Run ConnectApp
    /**
     * Create test user profile and seed the db
     */

    afterEach(() => {
    logout()
});

/*
  Basic dashboard tests starts here
   */
it("Check dashboard for all tabs", () => {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.get(dashboardLandingPageElements[5].tabs[0][languageStrings]).each(item => {
        cy.contains("#sidebar", item);
    });
});

it("Check dashboard for all panels", () => {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.get(dashboardLandingPageElements[6].panels[0][languageStrings]).each(item => {
        cy.contains(".dashboard", item);
    });
});

it("Check dashboard for all buttons", () => {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.get(dashboardLandingPageElements[7].buttons[0][languageStrings]).each(item => {
        cy.contains(".dashboard", item);
    });
});

it('Check dashboard page\'s links are not broken', () => {
    const profileDropdownMenu = dashboardLandingPageElements[8].profile_dropdown
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    profileDropdownMenu.forEach(item => {
        cy.get(item[0]).click();
        cy.location('pathname').should('eq', `/${item[1]}`);
    });
})

it('Check language toggle menu', () => {
    const lang_toggle_menu = dashboardLandingPageElements[3].language_toggle_menu_icon[0].icon_xpath;
    const lang_toggle_menu_dropdown_menu_selector = dashboardLandingPageElements[4].language_toggle_menu_dropdown_options[0].css;
    const lang_toggle_menu_dropdown = dashboardLandingPageElements[4].language_toggle_menu_dropdown_options[0].ul_xpath;

    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.xpath(lang_toggle_menu).invoke("attr", "src").should('contain', 'tr.png');
    cy.get(lang_toggle_menu_dropdown_menu_selector).click().then(() => {
        cy.xpath(lang_toggle_menu_dropdown)
            .find('li').as('options')
        cy.get('@options')
            .then(options => [...options].map(option => option.innerHTML))
            .then(html => {
                expect(html[0]).to.have.string('tr.png')
                expect(html[1]).to.have.string('en.png')
            })
    })
});

it('Can toggle language option', () => {
    const lang_toggle_menu = dashboardLandingPageElements[3].language_toggle_menu_icon[0].icon_xpath;
    const lang_toggle_menu_dropdown_menu_selector = dashboardLandingPageElements[4].language_toggle_menu_dropdown_options[0].css;
    const lang_toggle_menu_dropdown = dashboardLandingPageElements[4].language_toggle_menu_dropdown_options[0].ul_xpath;
    let current_lang = '';

    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.xpath(lang_toggle_menu).then((lang_menu) => {
        if (lang_menu.attr('src').includes('tr')) {
            current_lang = connectorProTRLanguageCode;

            cy.get(dashboardLandingPageElements[5].tabs[0].tr).each(item => {
                cy.get('#sidebar').contains(item, { matchCase: false });
            });
        } else if (lang_menu.attr('src').includes('en')) {
            current_lang = connectorProENLanguageCode;

            cy.get(dashboardLandingPageElements[5].tabs[0].en).each(item => {
                cy.get('#sidebar').contains(item, { matchCase: false });
            });
        }
    })

    cy.get(lang_toggle_menu_dropdown_menu_selector).click().then(() => {
        if (current_lang === connectorProTRLanguageCode) {
            cy.xpath(lang_toggle_menu_dropdown)
                .find('li').as('options')
            cy.get('@options')
                .then(options => [...options].map(option => option.innerHTML))
                .then(html => {
                    expect(html[0]).to.have.string('tr.png')
                    cy.get(dashboardLandingPageElements[5].tabs[0].tr).each(item => {
                        cy.get('#sidebar').contains(item, { matchCase: false });
                    });
                })
        } else if (current_lang === connectorProENLanguageCode) {
            cy.get('@options')
                .then(options => [...options].map(option => option.innerHTML))
                .then(html => {
                    expect(html[1]).to.have.string('en.png')
                    cy.get(dashboardLandingPageElements[5].tabs[0].en).each(item => {
                        cy.get('#sidebar').contains(item, { matchCase: false });
                    });
                })
        }
    })
})
})
