/**
 * Semtrio Copyright (c) 2022
 *
 * Test calculations page on admin panel
 *
 * @summary Basic tests for Connectorpro admin panel calculation page using cypress
 * @author Parvez <parvezislam@semtrio.com>
 *
 * Created at     : 2022-06-28 08:51:56
 */
/// <reference types="cypress" />
require('cypress-xpath');
import {
    semtrioAdminPanelLogin,
    seedSemtrioAdminDb,
    unSeedSemtrioAdminDb,
    createSeedUser,
    semtrioAdminPanelTableHeadersAndPaginationButtonsValidation
} from '../../../helpers/util';

const semtrioAdminPanelHomePageElements = require('../../../fixtures/connectorprov2/admin_panel/home.json');
const semtrioAdminPanelCalculationsPageComponents = require ('../../../fixtures/connectorprov2/admin_panel/calculations.json');
const seedUser = createSeedUser();

// sanity checks
expect(semtrioAdminPanelHomePageElements, 'list of dashboard items').to.be.an('array');
expect(semtrioAdminPanelCalculationsPageComponents, 'list of calculations page items').to.be.an('array');

/**
 * Run all admin panel feature tests
 */
describe('Run Connector Pro v2 admin panel test', () => {
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
        cy.get(semtrioAdminPanelHomePageElements[3].tabs[2][0]).click();
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

    it('Validates calculations page', () => {
        cy.url().should('contain', `${semtrioAdminPanelCalculationsPageComponents[0].url}`);
        cy.get(semtrioAdminPanelCalculationsPageComponents[1].title[0])
        .should('contain', semtrioAdminPanelCalculationsPageComponents[1].title[1]);
    });

    it('Validates admin calculations page dropdown menus work', () => {
        let dropdownMenus = semtrioAdminPanelCalculationsPageComponents[2].dropdown_menus;
        dropdownMenus.forEach(ddmenu => {
            cy.xpath(ddmenu[0]).click();
            ddmenu[2].forEach(option => {
                cy.get(ddmenu[1]).should('contain', option);
            });
            cy.get(ddmenu[1]).type('{esc}');
        });
    });

    it('Validates calculations page\'s requests\' table', () => {
        semtrioAdminPanelTableHeadersAndPaginationButtonsValidation(semtrioAdminPanelCalculationsPageComponents[3].table);
    });
});