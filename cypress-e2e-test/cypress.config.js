const { defineConfig } = require("cypress");

module.exports = defineConfig({
  "viewportWidth": 1920,
  "viewportHeight": 1080,
  "projectId": 'm84n5a',
  e2e: {
    setupNodeEvents(on, config) {
      // load dynamic configurations from plugins/index
      return require('./cypress/plugins/index.js')(on, config);
    },
    reporter: "cypress-multi-reporters",
    env: {
      token: 'iq+Q7+oY5NdWAf6c8XQ2RtHMU01R8DtlPZjNv2My8v4=',
      apiBaseUrl: 'http://139.59.136.11:8003',
      loginEndPoint: '/auth/signin',
      username: 'gulimiremaimaiti@semtrio.com',
      password: '1234abcd'
    },
    reporterOptions: {
      reporterEnabled: "cypress-mochawesome-reporter, mocha-junit-reporter",
      mochaJunitReporterReporterOptions: {
        mochaFile: "cypress/results/test-results.xml",
        toConsole: false,
        includePending: true
      },
      cypressMochawesomeReporterReporterOptions: {
        charts: true,
        reportDir: "cypress/results",
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: true,
        debug: true,
        overwrite: false,
        html: true
      }
    }
  },
});
