
/// <reference types="cypress" />
require('cypress-xpath');
import {
    adminLogin,
    clickOnElementAndVisitPageAndCheckUrl,
    logout
} from '../../../helpers/util';
import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const calculationsPageElements = require('../../../fixtures/connectorprov2/dashboard/calculations.json');

let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(calculationsPageElements, 'list of calculations page items').to.be.an('array');


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

/**
 * Basic calculations' page tests start here
 */

const bottom_form_1 = calculationsPageElements[13].bottom_form_1
const bottom_form_2 = calculationsPageElements[13].bottom_form_2
const detailed_calculation_form = calculationsPageElements[12].Detailed_Calculation_form

function loginAndVisitCalculationsPage() {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].calculation[0], calculationsPageElements[0].url);
}

it('Check calculations page for all panels', () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[3].panels[1][languageStrings]).each(item => {
        cy.contains(calculationsPageElements[3].panels[0].css, item);
    });
});

it("Check calculations page for all buttons", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[4].buttons[1][languageStrings]).each(item => {
        cy.contains(calculationsPageElements[4].buttons[0].css, item);
    });
});

it("Check calculation page category 1 calculation form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[6].subcategories).each(item => {
        cy.get(item.css).click({ force: true });
        cy.get(item.calculation_form[0].css).click({ force: true })
        cy.get((item.calculation_form[1])[languageStrings]).each(string => {
            cy.contains(item.calculation_form[0].css, string)
        })
    })
})


it("Check the category 1 detailed calculation tables", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[6].subcategories).each((item, index) => {
        if (index < 4)
            cy.get(item.css).click({ force: true });
        cy.wait(1000)
        cy.get(calculationsPageElements[12].Detailed_Calculation_form[0].icon_css).click({ force: true })
        cy.get(calculationsPageElements[12].Detailed_Calculation_form[1][languageStrings]).each(string => {
            cy.contains(calculationsPageElements[12].Detailed_Calculation_form[0].calculation_form_css, string)
        })
    })
})

it("Check calculation page category 1 bottom form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[6].subcategories).each((item, index) => {
        if (index < 4) {
            cy.get(item.css).click({ force: true });
            cy.get(calculationsPageElements[13][languageStrings]).each(string => {
                cy.contains(bottom_form_1.css, string)
                cy.contains(bottom_form_2.css, string)
            })
        } else if (index === 4) {
            cy.get(item.css).click({ force: true });
            cy.get(calculationsPageElements[13][languageStrings]).each(string => {
                cy.contains(bottom_form_1.css, string)
            })
        } else {
            cy.get(calculationsPageElements[14].bottom_form_subcategory_6[languageStrings]).each(string => {
                cy.contains(bottom_form_1.css, string)
            })
        }
    })
})

it("Check calculation page category 2 calculation form and bottom forms components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[7].subcategories).each(item => {
        cy.get(item.css).click({ force: true });
        cy.get(item.calculation_form[0].css).click({ force: true })
        cy.get((item.calculation_form[1])[languageStrings]).each(string => {
            cy.contains(item.calculation_form[0].css, string)
        })

        cy.get(calculationsPageElements[13][languageStrings]).each(string => {
            cy.contains(bottom_form_1.css, string)
        })
    })
})

it("check calculation page category 3 form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[8].css).click({ force: true })
    cy.get(calculationsPageElements[8].subcategories).each(item => {
        cy.get(item[0].css).click({ force: true });
        cy.get((item[1].calculation_form[1])[languageStrings]).each(string => {
            cy.contains(item[1].calculation_form[0].css, string)
        })

        cy.get(calculationsPageElements[13][languageStrings]).each(string => {
            cy.contains(bottom_form_2.css, string)
        })
    })
})

it("check calculation page category 3 bulk shipping files section form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[8].css).click({ force: true })
    cy.get(calculationsPageElements[8].subcategories).each((item, i) => {
        if (i < 2) {
            cy.get(item[0].css).click({ force: true });
            cy.wait(1000)
            cy.get(calculationsPageElements[15].bulk_shipping_files_section[0].expanding_button_css).click()
            cy.get((calculationsPageElements[15].bulk_shipping_files_section[1])[languageStrings]).each(string => {
                cy.contains(calculationsPageElements[15].bulk_shipping_files_section[0].css, string)
            })
            cy.get((calculationsPageElements[15].bulk_shipping_files_section[2].Uploaded_Bulk_Shipping_Files[1])[languageStrings]).each(string => {
                cy.contains(calculationsPageElements[15].bulk_shipping_files_section[2].Uploaded_Bulk_Shipping_Files[0].css, string)
            })
        }
    })
})

it("check calculation page category 4 form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[9].css).click({ force: true })
    cy.get(calculationsPageElements[9].subcategories).each(item => {
        cy.get(item[0].css).click({ force: true });
        cy.get((item[1].calculation_form[1])[languageStrings]).each(string => {
            cy.contains(item[1].calculation_form[0].css, string)
        })

        cy.get(calculationsPageElements[13][languageStrings]).each(string => {
            cy.contains(bottom_form_2.css, string)
        })
    })
})

it("check calculation page category 5 form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[10].css).click()
    cy.get(calculationsPageElements[10].subcategories).each(item => {
        cy.get(item[0].css).click();
        cy.get((item[1].calculation_form[1])[languageStrings]).each(string => {
            cy.contains(item[1].calculation_form[0].css, string)
        })

        cy.get(calculationsPageElements[13][languageStrings]).each(string => {
            cy.contains(bottom_form_2.css, string)
        })
    })
})

it("check calculation page category 6 form components", () => {
    loginAndVisitCalculationsPage();
    cy.get(calculationsPageElements[11].css).click()
    cy.get((calculationsPageElements[11].calculation_form[1])[languageStrings]).each(string => {
        cy.contains(calculationsPageElements[11].calculation_form[0].css, string)
    })

    cy.get(calculationsPageElements[14].bottom_form_subcategory_6[languageStrings]).each(string => {
        cy.contains(bottom_form_1.css, string)
    })
})
})
