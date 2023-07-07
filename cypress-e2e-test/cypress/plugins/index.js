/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// const teardown = require("../helpers/db/teardown");
// const seed = require("../helpers/db/seed");
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
}

const postgreSQL = require('cypress-postgresql');
const pg = require('pg');
const dbConfig = require("../helpers/dbConfig.json");
const fs = require("fs-extra");
const path = require("path");

async function fetchConfigurationByFile(environment, testType, testSiteIsAdmin) {
    const pathOfConfigurationFile = `config/cypress.${environment}.config.json`;
    let configJson = await fs.readJson(path.join(__dirname, "../", pathOfConfigurationFile));
    let specPathPattern = "cypress/e2e/connectorprov2/TEST_SITE/**/TEST_TYPE*.{js,jsx,ts,tsx}";

    switch (testType) {
        case "functional":
            configJson.env.testType = 'functional';
            specPathPattern = specPathPattern.replace("TEST_TYPE", "functional_test");
            break;
        case "api":
            configJson.env.testType = 'api';
            specPathPattern = specPathPattern.replace("TEST_TYPE", "api_test");
            break;
        case "smoke":
        default:
            configJson.env.testType = 'smoke';
            specPathPattern = specPathPattern.replace("TEST_TYPE", "smoke_test");
    }

    if (testSiteIsAdmin) {
        configJson.env['testSite'] = 'admin';
        specPathPattern = specPathPattern.replace("TEST_SITE", "admin_panel");

        switch (configJson.env['environment']) {
            case "development":
                configJson.baseUrl = 'http://dev-test-admin.connectapp.com.tr';
                break;
            case "staging":
                configJson.baseUrl = 'https://admin.app.staging.connectapp.com.tr';
                break;
            case "production":
                configJson.baseUrl = 'http://prod-admin.connectapp.com.tr';
                break;
            case "test":
            default:
                configJson.baseUrl = 'http://test-admin.connectapp.com.tr';
        }
    } else {
        specPathPattern = specPathPattern.replace("TEST_SITE", "dashboard");
    }

    configJson.specPattern = specPathPattern;

    return (
        environment && configJson
    );
}

module.exports = async (on, config) => {
    require('cypress-mochawesome-reporter/plugin')(on);

    const testEnvironment = config.env.configFile || config.env['environment'] || "test";
    const testType = config.env['testType'];
    const testSiteIsAdmin = config.env['testSite'] === "admin";
    let configurationForEnvironment = await fetchConfigurationByFile(testEnvironment, testType, testSiteIsAdmin);
    const dbEnv = configurationForEnvironment.env.db;
    const pool = new pg.Pool(dbConfig[dbEnv]);
    let tasks = postgreSQL.loadDBPlugin(pool);

    console.log(configurationForEnvironment);
    on('task', tasks);
    return configurationForEnvironment || config;
};