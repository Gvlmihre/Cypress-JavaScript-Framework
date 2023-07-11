1. Install node.js, nvm: https://github.com/nvm-sh/nvm
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm`
2. Install cypress
3. Install all plugins: `nvm ci`
4. Run (for development): `cy:open:dev:dashboard`
Or (for headless running): `npx cypress run`

Reports
1. `npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator`
2. `npx cypress run --record --key 1d3bfd9e-e0b9-43c9-9d8d-fcdf4b906281 --spec "cypress/e2e/connectAppv2/smoke_test_authentications.spec.js" --config-file cypress.config.js.backup`

[Optional]
1. `cypress run --reporter mochawesome --reporter-options reportDir="cycpress/results",overwrite=false,html=true,json=true`
2. `npx mochawesome-merge "cypress/results/*.json" > mochawesome.json`
3. `npx marge mochawesome.json`

Gitlab Runner (specific features)
1. Parallel (experimental) runs can be executed using the cy:run:parallen:... scripts. More details in package.json
2. Set gitlab env variable $CYPRESS_TEST_ENV to one of the following: development, test, staging, production (first 2 implemented at this point) to dynamically set test only that environment
