/**

/// <reference types="cypress" />
import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";

require('cypress-xpath');

import {
  adminLogin,
  categoryOneCalculation,
  categoryThreeCalculation,
  categoryTwoCalculation,
  clickDropDownMenuAndSelectOption,

  clickOnElementAndVisitPageAndCheckUrl,
  selectFromVsDdmenu,
  selectYearAndLocation
} from '../../../helpers/util';

const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const calculationsPageElements = require('../../../fixtures/connectorprov2/dashboard/calculations.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(calculationsPageElements, 'list of calculations page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApp', () => {

  const username = `${Cypress.env('username')}`
  const password = `${Cypress.env('password')}`


  /* beforeEach(() => {
     cy.visit('/');
   });
 */
  /**
   * Functional tests for calculations page tests start here
   */

  function loginAndVisitCalculationsPage() {
    adminLogin(username, password);
    clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].calculation[0], calculationsPageElements[0].url);
  }

  it("category 1.1 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(0);
  })

  it("category 1.2 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(1);
  })

  it("category 1.3 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(2);
  })

  it("category 1.4 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(3);
  })

  it("category 1.5 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(4);
  })

  it("category 1.6 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryOneCalculation(5);
  })

  it("category 2.1 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryTwoCalculation(0)
  })

  it("category 2.2 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryTwoCalculation(1)
  })

  it.only("category 3.1 calculation", () => {
    loginAndVisitCalculationsPage();
    selectYearAndLocation();
    categoryThreeCalculation(1)
  })

});