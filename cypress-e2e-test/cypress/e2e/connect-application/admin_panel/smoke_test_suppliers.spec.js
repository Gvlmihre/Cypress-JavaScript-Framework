/**
 * Semtrio Copyright (c) 2022
 *
 * Test for suppliers page (admin panel)
 *
 * @summary Basic tests for Connectorpro admin panel's suppliers page using cypress
 * @author Parvez <parvezislam@semtrio.com>
 *
 * Created at     : 2022-10-24 08:51:56
 */
/// <reference types="cypress" />
require('cypress-xpath');
import {
    semtrioAdminPanelLogin,
    seedSemtrioAdminDb,
    unSeedSemtrioAdminDb,
    createSeedUser,
    semtrioAdminPanelTableHeadersAndPaginationButtonsValidation,
    semtrioAdminPanelClickOnTabAndValidateURLAndTitle
} from '../../../helpers/util';

const semtrioAdminPanelHomePageElements = require('../../../fixtures/connectorprov2/admin_panel/home.json');
const semtrioAdminPanelSuppliersPageComponents = require ('../../../fixtures/connectorprov2/admin_panel/suppliers.json');
const seedUser = createSeedUser();

// sanity checks
expect(semtrioAdminPanelHomePageElements, 'list of home page items').to.be.an('array');
expect(semtrioAdminPanelSuppliersPageComponents, 'list of suppliers-page items').to.be.an('array');

/**
 * Run all admin panel feature tests
 */
describe('Run Connector Pro v2 admin panel test for suppliers page', () => {
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
        cy.get(semtrioAdminPanelHomePageElements[3].tabs[3][0]).click();
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

    it('Validates suppliers page', () => {
        semtrioAdminPanelClickOnTabAndValidateURLAndTitle(semtrioAdminPanelHomePageElements[3].tabs[3][0],
            semtrioAdminPanelSuppliersPageComponents);
    });

    it('Validate admin association page\'s new-company button exits', () => {
        cy.get(semtrioAdminPanelSuppliersPageComponents[2].button[0])
        .should('contain', semtrioAdminPanelSuppliersPageComponents[2].button[1]);
    });

    it('Validates suppliers page\'s companies table', () => {
        semtrioAdminPanelTableHeadersAndPaginationButtonsValidation(semtrioAdminPanelSuppliersPageComponents[3].table);
    });

});