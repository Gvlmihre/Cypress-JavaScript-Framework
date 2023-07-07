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
      token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      apiBaseUrl: 'http://xxx.xx.xx.xx:xxxx',
      loginEndPoint: '/auth/signin',
      username: 'xxx@xxx.com',
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
