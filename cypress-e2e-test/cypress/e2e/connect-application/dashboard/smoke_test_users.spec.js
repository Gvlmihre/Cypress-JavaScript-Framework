
///<reference types="cypress-xpath" />

import {
    adminLogin,
    clickDropDownMenuAndValidateOptions,
    clickOnElementAndVisitPageAndCheckUrl,
    logout
} from '../../../helpers/util';
import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const usersPageElements = require('../../../fixtures/connectorprov2/dashboard/users.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(usersPageElements, 'list of users page items').to.be.an('array');


/**
 * More description
 */
describe('Run Connector Pro v2 users page smoke tests', () => {

    afterEach(() => {
        logout()
    });

    /**
     * Basic users' page tests start here
     */

    function loginAndVisitUsersPage() {
        adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
        clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].users[0], usersPageElements[0].url);
    }

    it('Check users page for title and description', () => {
        loginAndVisitUsersPage();
        cy.contains(usersPageElements[1].title[0].css, usersPageElements[1].title[0][languageStrings]);
        cy.contains(usersPageElements[2].description[0].css, usersPageElements[2].description[0][languageStrings]);
    });

    it("Check users page's input fields", () => {
        loginAndVisitUsersPage();
        cy.get(usersPageElements[3].input_fields).each(item => {
            cy.xpath(item.xpath).invoke('attr', 'placeholder').should('contain', item[languageStrings]);
        });
    });

    it("Check users page's users-panel headers", () => {
        loginAndVisitUsersPage();
        cy.get(usersPageElements[4].panel_users_tab_contents[1][languageStrings]).each(item => {
            cy.contains(usersPageElements[4].panel_users_tab_contents[0].css, item);
        });
    });

    it("Check users page's users-panel tab contents", () => {
        loginAndVisitUsersPage();
        cy.get('div.role-tabs div').each((item, index) => {
            cy.get(item).click()
            const users = usersPageElements[4].panel_users_tab_contents[2].tab_contents[index].content[0][languageStrings]
            console.log(users)
            cy.wait(1000)
            cy.get('div.user-grid>div').each((el, index1, $list) => {
                cy.wait(1000)
                if (index1 + 1 >= $list.length) {
                    cy.log('inside if ', index1 + 1, $list.length)
                } else {
                    cy.get('div.user-grid>div' + ':nth-child(' + (index1 + 1) + ')' + '>div.name').invoke('text').then((text) => {
                        cy.log(text)
                        cy.log(users)
                        users.push(text)
                        cy.log(users)
                    })
                }
            })
        })


        JSON.stringify(usersPageElements);

        cy.get(usersPageElements[4].panel_users_tab_contents[2].tab_contents).each(item => {
            cy.xpath(item.xpath).click();
            cy.get(item.content[0][languageStrings]).each(string => {
                cy.contains(usersPageElements[4].panel_users_tab_contents[0].css, string);
            });
        });
    });


    it("Check users page's change user information form", () => {
        loginAndVisitUsersPage();
        cy.get(usersPageElements[5].form_change_user_information.content).each(item => {
            cy.get(item[languageStrings]).each(string => {
                cy.contains(usersPageElements[5].form_change_user_information.css, string);
            });
        });
    });

    it("Check users page's assign locations to user section", () => {
        const locationGroupDropdownList = usersPageElements[6].Assign_locations_to_user_section[1].Location_Group_Dropdown_List;
        console.log('languageStrings', languageStrings)
        JSON.stringify(locationGroupDropdownList);
        loginAndVisitUsersPage();
        cy.get(locationGroupDropdownList).each(ddmenu => {
            console.log(ddmenu)
            clickDropDownMenuAndValidateOptions(ddmenu, languageStrings);
        });

        cy.xpath(usersPageElements[6].Assign_locations_to_user_section[2].Location_Search_section.xpath)
            .invoke('attr', 'placeholder').should('contain', usersPageElements[6].Assign_locations_to_user_section[2].Location_Search_section[languageStrings]);


        cy.get((usersPageElements[6].Assign_locations_to_user_section[3].locations_Table[0].content[0])[languageStrings]).each(string => {
            cy.contains(usersPageElements[6].Assign_locations_to_user_section[3].locations_Table[0].css, string)
        })

        cy.get((usersPageElements[6].Assign_locations_to_user_section[4].Assigned_Location_List_Table[0].content[0])[languageStrings]).each(string => {
            cy.contains(usersPageElements[6].Assign_locations_to_user_section[4].Assigned_Location_List_Table[0].css, string)
        })
    })
})

