/**
 * Semtrio Copyright (c) 2022
 *
 * Test for home page (admin panel)
 *
 * @summary Basic tests for Connectorpro admin panel's home page using cypress
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
  createSeedUser, semtrioAdminPanelClickOnTabAndValidateURL
} from '../../../helpers/util';

const semtrioAdminHomeTabElements = require('../../../fixtures/connectorprov2/admin_panel/home.json');
const seedUser = createSeedUser();

// sanity checks
expect(semtrioAdminHomeTabElements, 'list of home items').to.be.an('array');

/**
 * Run all admin panel feature tests
 */
describe('Run Connector Pro v2 admin panel test for home tab', () => {
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
   * Visit home page and log in before each test
   */
  beforeEach(() => {
    cy.visit('/');
    semtrioAdminPanelLogin(seedUser.email, seedUser.userPassword);
    cy.reload();//this is a workaround for bug CPV2-723
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

  it('Validate admin home tab', () => {
    cy.location('pathname').should('eq', `/${semtrioAdminHomeTabElements[0].url}`);
    cy.contains(semtrioAdminHomeTabElements[1].title);
    cy.contains(semtrioAdminHomeTabElements[2].welcome_panel[0].welcome_text);

    let welcome_logo = semtrioAdminHomeTabElements[2].welcome_panel[1].welcome_logo;
    welcome_logo[1].forEach(item => {
      cy.xpath(welcome_logo[0]).should('have.css', item[0], item[1]);
    });
  });

  it('Check links are not broken on home tab', () => {
    semtrioAdminHomeTabElements[3].tabs.forEach(item => {
      semtrioAdminPanelClickOnTabAndValidateURL(item[0], item[1]);
      cy.go('back');
    });
  });

});