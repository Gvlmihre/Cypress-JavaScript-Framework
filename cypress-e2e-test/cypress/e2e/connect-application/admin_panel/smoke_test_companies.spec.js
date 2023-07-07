/**
 * Semtrio Copyright (c) 2022
 *
 * Test for companies tab (admin panel)
 *
 * @summary Basic tests for Connectorpro admin panel's companies tab using cypress
 * @author Parvez <parvezislam@semtrio.com>
 *
 * Created at     : 2022-10-25 08:51:56
 */
/// <reference types="cypress" />
require('cypress-xpath');
import {
  semtrioAdminPanelLogin,
  seedSemtrioAdminDb,
  unSeedSemtrioAdminDb,
  createSeedUser,
  semtrioAdminPanelClickOnTabAndValidateURL
} from '../../../helpers/util';

const semtrioAdminHomePageElements = require('../../../fixtures/connectorprov2/admin_panel/home.json');
const semtrioAdminPanelCompaniesTabComponents = require('../../../fixtures/connectorprov2/admin_panel/companies.json');
const seedUser = createSeedUser();

// sanity checks
expect(semtrioAdminHomePageElements, 'list of home items').to.be.an('array');
expect(semtrioAdminPanelCompaniesTabComponents, 'list of companies-tab items').to.be.an('array');

/**
 * Run all admin panel feature tests
 */
describe('Run Connector Pro v2 admin panel test for companies tab', () => {
  /**
   * Create test user profile and seed the db
   */
  before(() => {
    seedSemtrioAdminDb(seedUser);
    cy.clearLocalStorage().then((ls) => {
      expect(ls.getItem('access_token')).to.be.null;
      expect(ls.getItem('expires_at')).to.be.null;
      expect(ls.getItem('refresh_token')).to.be.null;
    });
  });

  /**
   * Remove all test data after running tests
   */
  after(() => {
    unSeedSemtrioAdminDb(seedUser);
  });

  /**
   * Visit companies tab and log in before each test
   */
  beforeEach(() => {
    cy.visit('/');
    semtrioAdminPanelLogin(seedUser.email, seedUser.userPassword);
    cy.reload();//this is a workaround for bug CPV2-723
    cy.get(semtrioAdminHomePageElements[3].tabs[0][0]).click();
  });

  /**
   * Clear all local storage cache after each test
   */
  afterEach(() => {
    cy.clearLocalStorage().then((ls) => {
      expect(ls.getItem('access_token')).to.be.null;
      expect(ls.getItem('expires_at')).to.be.null;
      expect(ls.getItem('refresh_token')).to.be.null;
    });
  });

  it('Validate admin companies tab', () => {
    cy.url().should('contain', `/${semtrioAdminPanelCompaniesTabComponents[0].url}`);
    cy.contains(semtrioAdminPanelCompaniesTabComponents[1].title);
  });

  it('Validate admin companies tab new-company button exits', () => {
    cy.get(semtrioAdminPanelCompaniesTabComponents[2].button[0])
    .should('contain', semtrioAdminPanelCompaniesTabComponents[2].button[1]);
  });

  it('Validate admin companies tab searchbar exits', () => {
    cy.get(semtrioAdminPanelCompaniesTabComponents[3].searchbar[0]).invoke('attr', 'placeholder')
    .should('contain', semtrioAdminPanelCompaniesTabComponents[3].searchbar[1]);
  });

  it('Validate admin companies tab labels exist', () => {
    let labels = semtrioAdminPanelCompaniesTabComponents[4].labels;
    labels.forEach(label => {
      cy.get(label[0]).should('contain', label[1]);
    });
  });

  it('Validate admin companies tab dropdown menus exist', () => {
    let dropdownMenus = semtrioAdminPanelCompaniesTabComponents[5].dropdown_menus;
    dropdownMenus.forEach(ddmenu => {
      cy.xpath(ddmenu[0]).click();
      ddmenu[2].forEach(option => {
        cy.get(ddmenu[1]).should('contain', option);
      });
      cy.get(ddmenu[1]).type('{esc}');
    });
  });

  it('Validates companies\' tab\'s company-list table', () => {
    cy.get(semtrioAdminPanelCompaniesTabComponents[6].table.locator).should("contain", semtrioAdminPanelCompaniesTabComponents[6].table.title);
    semtrioAdminPanelCompaniesTabComponents[6].table.headers.forEach(item => {
      cy.get(semtrioAdminPanelCompaniesTabComponents[6].table.locator).should("contain", item);
    });
    cy.get(semtrioAdminPanelCompaniesTabComponents[6].table.pagination).find("button.v-pagination__navigation:first")
    .invoke("attr", "aria-label").should("equal", "Previous page");
    cy.get(semtrioAdminPanelCompaniesTabComponents[6].table.pagination).find("button.v-pagination__navigation:last")
    .invoke("attr", "aria-label").should("equal", "Next page");
  });

  it('Check links are not broken on companies tab', () => {
    semtrioAdminHomePageElements[3].tabs.forEach(item => {
      semtrioAdminPanelClickOnTabAndValidateURL(item[0], item[1]);
      cy.go('back');
    });
  });

});