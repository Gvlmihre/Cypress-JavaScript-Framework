import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

/**
 * Semtrio Copyright (c) 2022
 *
 * Test for demos
 *
 * @summary Basic tests for ConnectorPro v2 user profile page using cypress
 * @author Parvez <parvezislam@semtrio.com>
 *
 * Created at     : 2022-09-15 08:21:56
 */
/// <reference types="cypress" />
require('cypress-xpath');
import {
  logout,
  adminLogin,
  clickOnElementAndVisitPageAndCheckUrl,
  clickDropDownMenuAndValidateOptions
} from '../../../helpers/util';
const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const userProfilePageElements = require('../../../fixtures/connectorprov2/dashboard/user_profile.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(userProfilePageElements, 'list of user profile page items').to.be.an('array');


/**
 * More description
 */
describe('Run Connector Pro v2 user profile page smoke tests', () => {

  /**
   * Log out after each test
   */
  afterEach(() => {
    logout()
  });

  /**
   * Basic user profile page's tests start here
   */

  function loginAndVisitUserProfilePage() {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password)
    clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[0].header[0].links.user_profile[0], userProfilePageElements[0].url);
  }

  it('Check user profile page for title and description', () => {
    loginAndVisitUserProfilePage();
    cy.contains(userProfilePageElements[1].title[0].css, userProfilePageElements[1].title[0][languageStrings]);
    cy.contains(userProfilePageElements[2].description[0].css, userProfilePageElements[2].description[0][languageStrings]);
  });

  it("Check user profile page's general overview and help menu panel", () => {
    let userProfileLeftPanelContent = userProfilePageElements[3].panel_general_overview_and_help_menu[1][languageStrings];
    loginAndVisitUserProfilePage();
    cy.get(userProfileLeftPanelContent).each(string => {
      cy.get(userProfilePageElements[3].panel_general_overview_and_help_menu[0].container_css).contains(string, {matchCase: false});
    });
  });

  it("Check user profile page's left panel contents", () => {
    loginAndVisitUserProfilePage();
    cy.get(userProfilePageElements[4].panel_user_information[1].content).each(item => {
      cy.get(item.css).click();
      cy.get(item[languageStrings]).each(string => {
        cy.contains(userProfilePageElements[4].panel_user_information[0].container_css, string);
      });
    });
  });

  it("Check user profile page decimal notation dropdown in settings section", () => {
    const decimal_notation_ddmenu = userProfilePageElements[5].decimal_notation_menu[0]
    const user_profile_settings = userProfilePageElements[4].panel_user_information[1].content[1].xpath
    loginAndVisitUserProfilePage();
    cy.xpath(user_profile_settings).click()
    cy.wait(1000)
      clickDropDownMenuAndValidateOptions(decimal_notation_ddmenu, languageStrings)
    })

});