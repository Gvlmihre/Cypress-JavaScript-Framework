/**
 * Semtrio Copyright (c) 2022
 *
 * Test for memberships page (admin panel)
 *
 * @summary Basic tests for Connectorpro admin panel's memberships page using cypress
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
  createSeedUser
} from '../../../helpers/util';

const semtrioAdminPanelHomePanelPageElements
    = require('../../../fixtures/connectorprov2/admin_panel/home.json');
const semtrioAdminPanelMembershipsPageElements
    = require('../../../fixtures/connectorprov2/admin_panel/memberships.json');
const semtrioAdminPanelCompaniesPageElements
    = require('../../../fixtures/connectorprov2/admin_panel/companies.json');
const seedUser = createSeedUser();

// sanity checks
expect(semtrioAdminPanelHomePanelPageElements, 'list of home page items').to.be.an('array');
expect(semtrioAdminPanelMembershipsPageElements, 'list of memberships page items').to.be.an('array');
expect(semtrioAdminPanelCompaniesPageElements, 'list of membership page items').to.be.an('array');

/**
 * Run all admin panel feature tests
 */
describe('Run Connector Pro v2 admin panel test for memberships page', () => {
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
   * Visit memberships page and log in before each test
   */
  beforeEach(() => {
    cy.visit('/');
    semtrioAdminPanelLogin(seedUser.email, seedUser.userPassword);
    // cy.reload();//this is a workaround for bug CPV2-723
    cy.get(semtrioAdminPanelHomePanelPageElements[3].tabs[0][0]).click();
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

  it('Validates memberships page', () => {
    cy.get(semtrioAdminPanelHomePanelPageElements[3].tabs[1][0]).click();
    cy.url().should('contain', `${semtrioAdminPanelMembershipsPageElements[0].url}`);
    cy.get(semtrioAdminPanelMembershipsPageElements[1].title[0]).should('contain',
        semtrioAdminPanelMembershipsPageElements[1].title[1]);
  });

  it('Validates membership page\'s packages table', () => {
    cy.get(semtrioAdminPanelHomePanelPageElements[3].tabs[1][0]).click();

    cy.get(semtrioAdminPanelMembershipsPageElements[2].table.locator).should(
        "contain", semtrioAdminPanelMembershipsPageElements[2].table.title);
    semtrioAdminPanelMembershipsPageElements[2].table.headers.forEach(item => {
      cy.get(semtrioAdminPanelMembershipsPageElements[2].table.locator).should(
          "contain", item);
    });

    let package_names = semtrioAdminPanelMembershipsPageElements[4].package_list.packages;

    for (let i = 7; i < package_names.length; i++) {
      cy.get(semtrioAdminPanelMembershipsPageElements[2].table.locator).should(
          "contain", package_names[i]);
    }
  });

  it('Validates membership page\'s packages table is editable', () => {
    cy.get(semtrioAdminPanelHomePanelPageElements[3].tabs[1][0]).click();
    cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
        .membership_package_edit_form.edit_button_first).click();
    cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
        .membership_package_edit_form.form_locator).within(() => {
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.package_name[0]).should("contain.text", semtrioAdminPanelMembershipsPageElements[3].membership_package_edit_form.package_name[1]);
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.input_try).should("be.visible");
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.input_usd).should("be.visible");
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.button_close).should("be.visible").should("not.be.disabled");
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.button_confirm).should("be.visible").should("be.disabled");
          cy.xpath(semtrioAdminPanelMembershipsPageElements[3]
              .membership_package_edit_form.button_reset).should("be.visible").should("not.be.disabled");
        });
  });

});