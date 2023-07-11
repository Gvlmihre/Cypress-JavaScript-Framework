
/// <reference types="cypress" />
require('cypress-xpath');
import {
    logout,
    adminLogin,
} from '../../../helpers/util';
const dashboardLandingPageElements = require('../../../fixtures/connectAppv2/dashboard/dashboard.json');
const connectAppLanguageEnCode = "en"
// sanity check
expect(dashboardLandingPageElements, 'list of dashboard items').to.be.an('array');

import loginPageElements from "../../../fixtures/connectAppv2/dashboard/login_page.json";

describe('Run ConnectApp

    it('User is redirected to login page', () => {
    cy.visit('/')
    cy.url().should('contain', '/login');
    cy.contains('Hoşgeldiniz');
    cy.contains('Oturum Aç');
})

    it("User can login with email address and password", () => {
    const email_field_css = 'div.inner:nth-child(1) > div:nth-child(2) > input:nth-child(1)'
    const password_field_css = '#loginPassword'
    cy.visit('/')
    cy.get(email_field_css)
        .invoke('attr', 'placeholder')
        .should('contain', 'Kullanıcı Adı');
    cy.get(password_field_css).invoke("attr", "placeholder")
        .should('contain', 'Şifre');

    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    cy.url().should('contain', 'dashboard');
    cy.contains('Çıkış');
});

it("User can logout", () => {
    adminLogin(loginPageElements[0].admin_username, loginPageElements[1].password);
    logout();
    cy.contains('Hoşgeldiniz');
});

const username = loginPageElements[0].admin_username
const password = loginPageElements[1].password
it("Test localstorage access_token injection for valid login", () => {
    cy.request({
        method: 'POST',
        url: 'http://139.59.136.11:8000/auth/signin',
        //form : true,
        body: {
            username: username,
            password: password
        }
    }).then(results => {
        const token = results.body.accessToken
        cy.log(token)
        localStorage.setItem('access_token', token);
        localStorage.setItem('refresh_token', null);
        localStorage.setItem('expires_at', null);
        expect(localStorage.getItem('access_token')).to.equal(token);

        cy.visit('/dashboard');
        cy.url().should('contain', 'company-selection');
        cy.contains('Giriş yapmak istediğiniz firmayı seçiniz');
    });
})

it("Test localstorage access_token removal for valid logout", () => {

    cy.request({
        method: 'POST',
        url: 'http://139.59.136.11:8000/auth/signin',
        //form : true,
        body: {
            username: username,
            password: password
        }
    }).then(results => {
        const token = results.body.accessToken
        cy.log(token)
        localStorage.setItem('access_token', token);

        cy.visit('/dashboard');
        cy.url().should('contain', 'company-selection');

        cy.clearLocalStorage().then(() => {
            cy.visit('/dashboard');
            expect(localStorage.getItem('access_token')).to.be.null;
            cy.url().should('contain', 'login');
        });
    });
})

it("Test localstorage EN lang code injection for English strings", () => {
    cy.request({
        method: 'POST',
        url: 'http://139.59.136.11:8000/auth/signin',
        //form : true,
        body: {
            username: username,
            password: password
        }
    }).then(results => {
        const token = results.body.accessToken
        cy.log(token)
        localStorage.setItem('access_token', token);
        localStorage.setItem('co2nnectorpro-language-code', connectAppLanguageEnCode);
        expect(localStorage.getItem('co2nnectorpro-language-code')).to.equal(connectAppLanguageEnCode);

        cy.visit('/dashboard');
        cy.url().should('contain', 'company-selection');
        cy.contains('Please select the company you want to login');
    });
})
});