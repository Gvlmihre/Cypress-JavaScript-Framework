#!/bin/bash

#run.sh [test_env=test|development] [test_site=dashboard|admin] [test_type=smoke|functional]
#default is: run  test dashboard smoke
if [[ $1 = "development" || ${CYPRESS_TEST_ENV} = "development" ]]; then
  if [[ $2 = "admin" || ${CYPRESS_TEST_SITE} = "admin" ]]; then
    npm run cy:run:dev:admin
    #TODO: option for admin panel functional tests on develop environment
  else
    if [[ $3 = "functional" || ${CYPRESS_TEST_TYPE} = "functional" ]]; then
      npm run cy:run:dev:functional:dashboard
       else
          if [[ $3 = "api" || ${CYPRESS_TEST_TYPE} = "api" ]]; then
            npm run cy:run:dev:api:dashboard
    else
#    defaults to smoke test on  dev pipeline for dashboard site
      npm run cy:run:dev:dashboard
      fi
    fi
  fi
elif [[ $1 = "test" || ${CYPRESS_TEST_ENV} = "test" ]]; then
  if [[ $2 = "admin" || ${CYPRESS_TEST_TYPE} = "admin" ]]; then
    npm run cy:run:test:admin
    #TODO: option for admin panel functional tests on test environment
  else
    if [[ $3 = "functional" || ${CYPRESS_TEST_TYPE} = "functional" ]]; then
      npm run cy:run:test:functional:dashboard
      else
          if [[ $3 = "api" || ${CYPRESS_TEST_TYPE} = "api" ]]; then
            npm run cy:run:test:api:dashboard
    else
#    defaults to smoke test on test pipeline for dashboard site
      npm run cy:run:test:dashboard
      fi
    fi
  fi
else
#  always defaults to smoke test on  test pipeline
  npm run cy:run:test:dashboard
fi

exit 0