import loginPageElements from "../../../fixtures/connectorprov2/dashboard/login_page.json";


/// <reference types="cypress" />
require('cypress-xpath');
import {
    clickOnElementAndVisitPageAndCheckUrl,
    clickDropDownMenuAndValidateOptions,
    logout,
    adminLogin
} from '../../../helpers/util';
import loginAndVisitCompanyInfoPage from "../../../fixtures/connectorprov2/dashboard/company_info.json";

const connectorproCommonElements = require('../../../fixtures/connectorprov2/dashboard/common.json');
const companyInfoPageElements = require('../../../fixtures/connectorprov2/dashboard/company_info.json');
let languageStrings = 'tr';

// sanity check
expect(connectorproCommonElements, 'list of common items').to.be.an('array');
expect(companyInfoPageElements, 'list of companyInfo page items').to.be.an('array');


/**
 * More description
 */
describe('Run ConnectApp page smoke tests', () => {
    /**
     * Create test user profile and seed the db
     */

    afterEach(() => {
        logout()
    });

    /**
     * Basic company information page's tests start here
     */

    function loginAndVisitCompanyInfoPage() {
        adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
        clickOnElementAndVisitPageAndCheckUrl(connectorproCommonElements[3].sidebar[0].company_info[0], companyInfoPageElements[0].url);
    }

    it('Check companyInfo page for title and description', () => {
        loginAndVisitCompanyInfoPage();
        cy.contains(companyInfoPageElements[1].title[0].css, companyInfoPageElements[1].title[0][languageStrings]);
        cy.contains(companyInfoPageElements[2].description[0].css, companyInfoPageElements[2].description[0][languageStrings]);
    });

    it("Check companyInfo page's update company info form", () => {
        loginAndVisitCompanyInfoPage();
        cy.get(companyInfoPageElements[6].form_change_company_information.content).each(item => {
            cy.get(item[languageStrings]).each(string => {
                cy.contains(companyInfoPageElements[6].form_change_company_information.css, string);
            });
        });
    });

    it("Check companyInfo page for primary industry dropdown menu", () => {
        const dropdownMenu = companyInfoPageElements[3].primary_industry;
        loginAndVisitCompanyInfoPage();
        cy.get(dropdownMenu).each(ddmenu => {
            clickDropDownMenuAndValidateOptions(ddmenu, languageStrings);
        });
    });

    it("Check companyInfo page for primary sector dropdown menu", () => {
        const primaryIndustry = companyInfoPageElements[3].primary_industry
        const primarySector = companyInfoPageElements[4].primary_sector
        const primaryActivity = companyInfoPageElements[5].primary_activity
        loginAndVisitCompanyInfoPage();
        cy.get(primaryIndustry[0].options_css)
            .each((option, i) => {
                cy.xpath(primaryIndustry[0].xpath)
                    .select(i).then(() => {
                        cy.wait(1000)
                        cy.get(primarySector[0].options_locater)
                            .each((elem, index) => {
                                cy.xpath(primarySector[0].xpath)
                                    .select(index).then(() => {
                                        cy.wait(1000)
                                        if (i === 0) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[0].üretim[index], languageStrings)
                                        }
                                        if (i === 1) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[1].Enerji_üretimi[index], languageStrings)
                                        }
                                        if (i === 2) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[2].Uluslararası_kuruluşlar[index], languageStrings)
                                        }
                                        if (i === 3) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[3].Giyim[index], languageStrings)
                                        }
                                        if (i === 4) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[4].Materyal_malzeme[index], languageStrings)
                                        }
                                        if (i === 5) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[5].Biyoteknoloji_sağlık_ve_ilaç[index], languageStrings)
                                        }
                                        if (i === 6) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[6].Hizmetler[index], languageStrings)
                                        }
                                        if (i === 7) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[7].Perakende[index], languageStrings)
                                        }
                                        if (i === 8) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[8].Altyapı[index], languageStrings)
                                        }
                                        if (i === 9) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[9].Hizmet_sektörü[index], languageStrings)
                                        }
                                        if (i === 10) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[10].Fosil_yakıtlar[index], languageStrings)
                                        }
                                        if (i === 11) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[11].Ulaşım_hizmetleri[index], languageStrings)
                                        }
                                        if (i === 12) {
                                            clickDropDownMenuAndValidateOptions(primaryActivity[12].Yiyecek_içecek_ve_tarım[index], languageStrings)
                                        }
                                    })
                            })
                    })
            })
    })
})


