
/// <reference types="cypress" />
require('cypress-xpath');
import {
  adminLogin,
  logout,
  clickOnElementAndVisitPageAndCheckUrl,
  clickDropDownMenuAndValidateOptions
} from '../../../helpers/util';
import dashboardLandingPageElements from "../../../fixtures/connectAppv2/dashboard/dashboard.json";
import loginPageElements from "../../../fixtures/connectAppv2/dashboard/login_page.json"

const connectAppCommonElements = require('../../../fixtures/connectAppv2/dashboard/common.json');
const locationPageElements = require('../../../fixtures/connectAppv2/dashboard/locations.json');
let languageStrings = 'tr';

// sanity check
expect(connectAppCommonElements, 'list of common items').to.be.an('array');
expect(locationPageElements, 'list of location page items').to.be.an('array');
expect(loginPageElements, 'list of login page items').to.be.an('array');

/**
 * More description
 */
describe('Run ConnectApp

  afterEach(() => {
  logout()
});

/*
Basic location tab tests start here
 */
function loginAndVisitLocationsPage() {
  adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
  clickOnElementAndVisitPageAndCheckUrl(
    connectAppCommonElements[3].sidebar[0].locations[0],
    locationPageElements[0].url);
}

it('Check locations page for all panels', () => {
  loginAndVisitLocationsPage();
  cy.get(locationPageElements[2].panels[0][languageStrings]).each(item => {
    cy.contains(locationPageElements[3].buttons[0].css, item);
  });
});

it("Check location page for all buttons", () => {
  loginAndVisitLocationsPage();
  cy.get(locationPageElements[3].buttons[1][languageStrings]).each(item => {
    cy.contains(locationPageElements[3].buttons[0].css, item);
  });
});

it("Check location page for location settings form elements", () => {
  loginAndVisitLocationsPage();
  cy.get(
    locationPageElements[4].location_settings_form[1][languageStrings]).each(
      item => {
        cy.contains(locationPageElements[4].location_settings_form[0].css,
          item);
      });
});

it("Check location page for location groups dropdown menu options", () => {
  const locationPageDropdownMenus = locationPageElements[5].dropdown_menus;
  JSON.stringify(locationPageDropdownMenus);

  loginAndVisitLocationsPage();
  cy.get(locationPageDropdownMenus).each(ddmenu => {
    clickDropDownMenuAndValidateOptions(ddmenu, languageStrings);
  });
});

it("Check location page for location groups dropdown table headers", () => {
  loginAndVisitLocationsPage();
  cy.get(
    locationPageElements[6].location_group_panel_table_headers[1][languageStrings]).each(
      item => {
        cy.contains(
          locationPageElements[6].location_group_panel_table_headers[0].css,
          item);
      });
});

it('Check location page links are not broken', () => {
  loginAndVisitLocationsPage();
  const profileDropdownMenu = dashboardLandingPageElements[8].profile_dropdown
  profileDropdownMenu.forEach(item => {
    cy.get(item[0]).click();
    cy.location('pathname').should('eq', `/${item[1]}`);
    cy.go('back')
  });
});
})