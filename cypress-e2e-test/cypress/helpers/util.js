import calculationsPageElements from "../fixtures/connectorprov2/dashboard/calculations.json";
const faker = require("faker");

const test_url='http://test-app.co2nnectorpro.com.tr/login'
const username_field='div.inner > div:nth-child(2) > input'
const password_field ='#loginPassword'
const login_button= 'div.container>div:nth-child(2)>button'
const first_company= "table > tbody>tr:nth-child(1)"
const connectorProTRLanguageCode="tr"
const connectorProENLanguageCode="en"
export const adminLogin = (username, password) => {
    cy.visit(test_url)
    cy.get(username_field)
        .type(username)
        .should('have.value', username);
    cy.get(password_field).type(password);
    cy.get(login_button).click();

    const current_language_code = localStorage.getItem('co2nnectorpro-language-code');
    cy.log(current_language_code)
    if(current_language_code === 'tr') {
        cy.contains('Giriş yapmak istediğiniz firmayı seçiniz');
    } else if(current_language_code === 'en') {
        cy.contains('Giriş yapmak istediğiniz firmayı seçiniz');
    }
    cy.log("Logged in welcome page successfully.");

    cy.get(first_company).click()

    if(current_language_code === 'tr') {
        cy.contains('Çıkış');
    } else if(current_language_code === 'en') {
        cy.contains('Logout');
    }
    cy.log("Logged in successfully.");
};

export const logout = () => {
    cy.get('.logout').click({force: true});
    
    const current_language_code = localStorage.getItem('co2nnectorpro-language-code');
    if(current_language_code === 'tr') {
        cy.contains('Oturum Aç');
    } else if(current_language_code === 'en') {
        cy.contains('Login');
    }
    cy.log("Logged out successfully.")
}

export const clickOnElementAndVisitPageAndCheckUrl = (selector, urlContains) =>  {
    cy.get(selector, { timeout: 5000 }).should('be.visible').click().then(() => {
        cy.location('pathname').should('contain', urlContains);
    });
};

export const clickDropDownMenuAndValidateOptions = (dropdownMenuSelector, languageOption) => {
    if(dropdownMenuSelector.xpath.endsWith('select')) {
        cy.xpath(dropdownMenuSelector.xpath).find('option').then(opts => {
            let actual = [...opts].map(o => o.text).sort();
            let expected = dropdownMenuSelector.options[languageOption].sort();
            console.log('actual', actual.toString())
            console.log('expected', expected.toString())
            expect(actual).to.be.deep.eq(expected);

            if(dropdownMenuSelector.hasOwnProperty('option_to_select')) {
                cy.xpath(dropdownMenuSelector.xpath).select(dropdownMenuSelector.option_to_select.text[languageOption])
                    .should('have.value', dropdownMenuSelector.option_to_select.value);
            }
        });
    } else {
        cy.xpath(dropdownMenuSelector.xpath).click();
        cy.get(dropdownMenuSelector.options[languageOption]).each(option => {
            cy.xpath(dropdownMenuSelector.xpath_options_container).should('contain', option);
        });
        cy.xpath(dropdownMenuSelector.xpath).click().type('{esc}');
    }
};

export const clickToCheckButtonActionAndInputLabel = (subcategory) => {
    cy.get(subcategory.css).click().then(() => {
        cy.get(subcategory[languageStrings]).each(item => {
            cy.contains(calculationsPageElements[6].forms.css_container, item);
        });
    });
}
export const selectFromVsDdmenu = (vsDdmenuSelector) => {
      let index
      cy.get(vsDdmenuSelector+'>div').click({force:true})
      cy.get(vsDdmenuSelector).find('li').as('options').then(() => {
          cy.get('@options').each((el, i, list) => {
               index = faker.mersenne.rand(list.length-1, 0)
          }).then(() => {
              cy.get('@options').eq(index).click({force:true})
              cy.wait(1000)
          })
       })
    }

export const getSelectDdmenuLength = (selectDdmenuSelector) => {
    let length
    cy.get(selectDdmenuSelector + '>option').each((el, i, list) => {
        length = list.length
    })
    return length
}

export const selectYearAndLocation = () => {
    const yearVsDdMenuCss = calculationsPageElements[16].yearDdMenu.yearVsDdmenuCss
    const locationVsDdmenuCss = calculationsPageElements[17].locationDdMenu.locationVsDdmenuCss
    selectFromVsDdmenu(yearVsDdMenuCss)
    cy.wait(1000)
    selectFromVsDdmenu(locationVsDdmenuCss)
}
    const fillCalculationForm = () => ({
        emission_industry: faker.mersenne.rand(3, 0),
        emission_source_selection: faker.mersenne.rand(2, 0),
        consumption_amount: faker.mersenne.rand(400, 10),
        unit:faker.mersenne.rand(10, 0),
        explanation: "cypress_test_" +  faker.lorem.word(),
        data_source: faker.mersenne.rand(3, 0),
        device_type: faker.mersenne.rand(10, 0),
        gas_capacity: faker.mersenne.rand(5000, 50),
        fill_amount: faker.mersenne.rand(4000, 100),
        shipping_type_selection: faker.mersenne.rand(2, 0),
        departure_filling: 'ist',
        arrival_filling: 'ank',
        distance: faker.mersenne.rand(7000, 100),
        weight: faker.mersenne.rand(4000, 500),
        activity: "Cypress"+ faker.lorem.word(),
        description: "cypress_test_description" +  faker.lorem.word(),
        activity_data: faker.mersenne.rand(3000, 500),
        ef: faker.mersenne.rand(1000, 10)
    })
export const categoryOneCalculation = (index) => {
    const categoryOneSubCategories= calculationsPageElements[18].categoryOneCalculationForm.category_one_subcategories
    const emissionIndustry = calculationsPageElements[18].categoryOneCalculationForm.emission_industry
    const selectEmissionSource = calculationsPageElements[18].categoryOneCalculationForm.select_emission_source
    const selectEmissionSource2 = calculationsPageElements[18].categoryOneCalculationForm.select_emission_source2
    const selectEmissionSource4 = calculationsPageElements[18].categoryOneCalculationForm.select_emission_source4
    const consumptionAmount = calculationsPageElements[18].categoryOneCalculationForm.consumption_amount
    const unit = calculationsPageElements[18].categoryOneCalculationForm.unit
    const dataSource = calculationsPageElements[18].categoryOneCalculationForm.data_source
    const deviceType = calculationsPageElements[18].categoryOneCalculationForm.device_type
    const gasCapacity = calculationsPageElements[18].categoryOneCalculationForm.gas_capacity
    const fillAmount = calculationsPageElements[18].categoryOneCalculationForm.fill_amount
    const ef = calculationsPageElements[18].categoryOneCalculationForm.ef
    const ef5 = calculationsPageElements[18].categoryOneCalculationForm.ef5
    const explanation = calculationsPageElements[18].categoryOneCalculationForm.explanation
    const documentUpload = calculationsPageElements[18].categoryOneCalculationForm.documents
    const documentUpload4 = calculationsPageElements[18].categoryOneCalculationForm.choose_a_file
    const save = calculationsPageElements[18].categoryOneCalculationForm.save
    const explanation1 = calculationsPageElements[18].categoryOneCalculationForm.explanation1
    const activity = calculationsPageElements[18].categoryOneCalculationForm.activity
    const amount = calculationsPageElements[18].categoryOneCalculationForm.amount
    const successMessage = calculationsPageElements[18].categoryOneCalculationForm.success_message

    const current_language_code = localStorage.getItem('co2nnectorpro-language-code');
    cy.log(current_language_code)
        if(index<4){
            if(index === 2){
                cy.get(`${categoryOneSubCategories}:nth-child(${index+1})`).click()
                cy.wait(3000)
                cy.get(emissionIndustry).select(fillCalculationForm().emission_industry)
                cy.get(selectEmissionSource2).select(fillCalculationForm().emission_source_selection)
                cy.get(consumptionAmount).type(fillCalculationForm().consumption_amount)
                cy.get(explanation).type(fillCalculationForm().explanation)
                cy.get(documentUpload).selectFile('dosya.pdf')
                cy.get(save).click()
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("Carbon Footprint Saved!");
                })
            }else{
                cy.get(`${categoryOneSubCategories}:nth-child(${index+1})`).click()
                cy.wait(3000)
                cy.get(selectEmissionSource).select(fillCalculationForm().emission_source_selection)
                cy.get(consumptionAmount).type(fillCalculationForm().consumption_amount)
                cy.get(explanation).type(fillCalculationForm().explanation)
                cy.get(documentUpload).selectFile('dosya.pdf')
                cy.get(save).click()
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("Carbon Footprint Saved!");
                })
            }
        } else if(index === 4){
            cy.get(`${categoryOneSubCategories}:nth-child(${index+1})`).click()
            cy.wait(3000)
            cy.get(dataSource).select(fillCalculationForm().data_source)
            cy.get(deviceType).select(fillCalculationForm().device_type)
            cy.wait(1000)
            selectFromVsDdmenu(selectEmissionSource4)
            cy.get(gasCapacity).type(fillCalculationForm().gas_capacity)
            cy.get(fillAmount).type(fillCalculationForm().fill_amount)
            cy.get(ef).type(fillCalculationForm().ef)
            cy.get(documentUpload4).selectFile('dosya.pdf')
            cy.get(explanation1).type(fillCalculationForm().explanation)
            cy.get(save).click()
            cy.get(successMessage).as('successMessage').then((el) => {
                if(current_language_code === 'tr') {
                    expect(el.text()).to.contains('İşlem Başarılı')
                } else if(current_language_code === 'en') {
                    expect(el.text()).to.contains('Success')
                }
                cy.log("Carbon Footprint Saved!");
            })

        } else if(index === 5){
            cy.get(`${categoryOneSubCategories}:nth-child(${index+1})`).click()
            cy.wait(3000)
            cy.get(activity).type(fillCalculationForm().activity)
            cy.get(amount).type(fillCalculationForm().fill_amount)
            cy.get(unit).select(fillCalculationForm().unit)
            cy.get(ef5).type(fillCalculationForm().ef)
            cy.get(save).click()
            cy.get(successMessage).as('successMessage').then((el) => {
                if(current_language_code === 'tr') {
                    expect(el.text()).to.contains('İşlem Başarılı')
                } else if(current_language_code === 'en') {
                    expect(el.text()).to.contains('Success')
                }
                cy.log("Carbon Footprint Saved!");
            })
        }
    }

export const categoryTwoCalculation = (index) => {
    const current_language_code = localStorage.getItem('co2nnectorpro-language-code');
    const subcategories = calculationsPageElements[19].categoryTwoCalculationForm.subcategories
    const selectEmissionSource = calculationsPageElements[19].categoryTwoCalculationForm.select_emission_source
    const unit = calculationsPageElements[19].categoryTwoCalculationForm.unit
    const consumptionAmount = calculationsPageElements[19].categoryTwoCalculationForm.consumption_amount
    const ef = calculationsPageElements[19].categoryTwoCalculationForm.ef
    const explanation = calculationsPageElements[19].categoryTwoCalculationForm.explanation
    const documents = calculationsPageElements[19].categoryTwoCalculationForm.choose_a_file
    const save = calculationsPageElements[19].categoryTwoCalculationForm.save
    const successMessage = calculationsPageElements[19].categoryTwoCalculationForm.success_message


    if (index === 0) {
        const i = faker.mersenne.rand(1, 0)
        cy.get(`${subcategories}:nth-child(${index + 1})`).click()
        cy.wait(2000)
        cy.get(selectEmissionSource).select(i)
        cy.get(unit).select(0)
        cy.get(consumptionAmount).type(fillCalculationForm().consumption_amount)
        if (i === 1) {
            cy.get(ef).type(fillCalculationForm().ef)
        }
        cy.get(explanation).type(fillCalculationForm().explanation)
        cy.get(documents).selectFile('dosya.pdf')
        cy.get(save).click()
        cy.get(successMessage).as('successMessage').then((el) => {
            if (current_language_code === 'tr') {
                expect(el.text()).to.contains('İşlem Başarılı')
            } else if (current_language_code === 'en') {
                expect(el.text()).to.contains('Success')
            }
            cy.log("Carbon Footprint Saved!");
        })
    } else {
        const i = faker.mersenne.rand(2, 0)
        cy.get(`${subcategories}:nth-child(${index + 1})`).click()
        cy.wait(2000)
        cy.get(selectEmissionSource).select(i)
        cy.get(unit).select(0)
        cy.get(consumptionAmount).type(fillCalculationForm().consumption_amount)
        if (i === 0) {
            cy.get(ef).type(fillCalculationForm().ef)
        }
        cy.get(explanation).type(fillCalculationForm().explanation)
        cy.get(documents).selectFile('dosya.pdf')
        cy.get(save).click()
        cy.get(successMessage).as('successMessage').then((el) => {
            if (current_language_code === 'tr') {
                expect(el.text()).to.contains('İşlem Başarılı')
            } else if (current_language_code === 'en') {
                expect(el.text()).to.contains('Success')
            }
            cy.log("Carbon Footprint Saved!");
        })
    }
}

export const categoryThreeCalculation = (index) => {
    const current_language_code = localStorage.getItem('co2nnectorpro-language-code');
    const categoryThree = calculationsPageElements[20].categoryThreeCalculationForm.category_three
    const subcategories = calculationsPageElements[20].categoryThreeCalculationForm.subcategories
    const selectShippingType = calculationsPageElements[20].categoryThreeCalculationForm.select_shipping_type
    const selectActivityType = calculationsPageElements[20].categoryThreeCalculationForm.select_activity_type
    const selectSubType = calculationsPageElements[20].categoryThreeCalculationForm.select_sub_type
    const selectSize = calculationsPageElements[20].categoryThreeCalculationForm.select_size
    const departure = calculationsPageElements[20].categoryThreeCalculationForm.departure
    const arrival = calculationsPageElements[20].categoryThreeCalculationForm.arrival
    const distance = calculationsPageElements[20].categoryThreeCalculationForm.distance
    const weight = calculationsPageElements[20].categoryThreeCalculationForm.weight
    const ef = calculationsPageElements[20].categoryThreeCalculationForm.ef
    const explanation = calculationsPageElements[20].categoryThreeCalculationForm.explanation
    const document = calculationsPageElements[20].categoryThreeCalculationForm.choose_a_file
    const save = calculationsPageElements[20].categoryThreeCalculationForm.save
    const successMessage = calculationsPageElements[19].categoryTwoCalculationForm.success_message
    const bulkShippingFiles = calculationsPageElements[20].categoryThreeCalculationForm.bulk_shipping_files_button
    const documentBulk = calculationsPageElements[20].categoryThreeCalculationForm.choose_a_file_bulk
    const uploadFile = calculationsPageElements[20].categoryThreeCalculationForm.upload_bulk_shipping_file
    //const i = faker.mersenne.rand(3,0)

    cy.get(categoryThree).click()
    if(index === 0 || index === 1){
        cy.get(`${subcategories}:nth-child(${index + 1})`).click()
        cy.wait(2000)

        let j
        cy.get(selectShippingType+'>div').click({force:true})
        cy.get(selectShippingType).find('li').as('options').then(() => {
            cy.get('@options').each((el, i, list) => {
                j = faker.mersenne.rand(list.length-1, 0)
            }).then(() => {
                cy.log(j)
                cy.get('@options').eq(j).click({force:true})
                cy.wait(2000)
            })
        }).then(() => {
            if(j === 1 ){
                cy.get(departure).type('ist').then(() => {
                    cy.get(departure).find('li').eq(3).click()
                })
                cy.get(arrival).type('ank').then(() => {
                    cy.get(arrival).find('li').eq(2).click()
                })
                cy.get(weight).type(fillCalculationForm().weight)
                cy.get(explanation).type(fillCalculationForm().explanation)
                cy.get(document).selectFile('connectorPro.xlsx')
                cy.get(save).click()
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("Carbon Footprint Saved!");
                })

                cy.wait(3000)
                cy.get(bulkShippingFiles).click({force:true})
                cy.get(documentBulk).selectFile('connectorPro.xlsx')
                cy.get(uploadFile).click({force:true})
                cy.wait(2000)
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("File Uploaded Successfully!");
                })
            } else {
                selectFromVsDdmenu(selectActivityType)
                selectFromVsDdmenu(selectSubType)
                selectFromVsDdmenu(selectSize)
                cy.get(departure).type('ist').then(() => {
                    cy.get(departure).find('li').eq(3).click()
                })
                cy.get(arrival).type('ank').then(() => {
                    cy.get(arrival).find('li').eq(2).click()
                })
                /*cy.get(departure).type('ist').then(() => {
                    cy.wait(1000)
                    selectFromVsDdmenu(departure)
                })
                cy.get(arrival).type('ank').then(() => {
                    cy.wait(1000)
                    selectFromVsDdmenu(arrival)
                })*/
                cy.get(distance).type(fillCalculationForm().distance)
                cy.get(weight).type(fillCalculationForm().weight)
                cy.get(ef).type(fillCalculationForm().ef)
                cy.get(explanation).type(fillCalculationForm().explanation)
                cy.get(document).selectFile('connectorPro.xlsx')
                cy.get(save).click()
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("Carbon Footprint Saved!");
                })

                cy.wait(3000)
                cy.get(bulkShippingFiles).click({force:true})
                cy.get(documentBulk).selectFile('connectorPro.xlsx', {force:true})
                cy.get(uploadFile).click({force:true})
                //cy.wait(2000)
                cy.get(successMessage).as('successMessage').then((el) => {
                    if(current_language_code === 'tr') {
                        expect(el.text()).to.contains('İşlem Başarılı')
                    } else if(current_language_code === 'en') {
                        expect(el.text()).to.contains('Success')
                    }
                    cy.log("File Uploaded Successfully!");
                })
            }
        })
    }
}
export const semtrioAdminPanelLogin = (username, password) => {
    cy.get("div.row:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > input").type(username)
        .should('have.value', username);
    cy.get("div.row:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input").type(password);
    cy.get(".v-btn__content").click();
    cy.contains('Admin Panel');
    cy.log("Logged into Semtrio Admin Panel.");
};

export const semtrioAdminPanelLogout = () => {
    cy.get(".mdi-logout").click();
    cy.log("Log out button clicked on Semtrio Admin Panel.");
};

export const semtrioAdminPanelClickOnTabAndValidateURL = (tabLocator, urlSub) => {
    cy.get(tabLocator).click();
    cy.url().should('contain', `${urlSub}`);
};

export const semtrioAdminPanelClickOnTabAndValidateURLAndTitle = (tabLocator, tabComponents) => {
    semtrioAdminPanelClickOnTabAndValidateURL(tabLocator, tabComponents[0].url);
    cy.get(tabComponents[1].title[0]).should('contain', tabComponents[1].title[1]);
};

export const semtrioAdminPanelTableHeadersAndPaginationButtonsValidation = (tableFixture) => {
    cy.get(tableFixture.locator).should("contain", tableFixture.title);
    tableFixture.headers.forEach(item => {
        cy.get(tableFixture.locator).should("contain", item);
    });
    cy.get(tableFixture.pagination).find("button.v-pagination__navigation:first")
        .invoke("attr", "aria-label").should("equal", "Previous page");
    cy.get(tableFixture.pagination).find("button.v-pagination__navigation:last")
        .invoke("attr", "aria-label").should("equal", "Next page");
};

export const getRandomArrayElement = (arr) => {
    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
};

export const apiForbiddenRequest = (apiMethod, headers, urlEndpoint, requestBody) => {
    cy.api(
        {
            method: apiMethod,
            url: `${Cypress.env('apiBaseUrl')}` + urlEndpoint,
            failOnStatusCode: false,
            headers: {
                'API-Key': headers
            },
            body: requestBody
        }).then(results => {
        const responseCode = results.status
        const statusText = results.statusText
        cy.log(results)
        cy.log(responseCode)
        expect(responseCode).to.deep.eq(401)
        expect(statusText).to.deep.eq('Unauthorized')
    })
}

export const getLocations = () => {

    let locationIds = []
               cy.apiRequest('GET', '/locations').then(json => {
                   cy.log(json)
                   cy.get(json.body.content).each(item => {
                       locationIds.push(item.id)
                   })
               })

    return locationIds
}

const fs = require('fs');
const path = require('path');
export const createFolderIfNotExists = (directoryPath) => {
    const directory = path.normalize(directoryPath);

    return new Promise((resolve, reject) => {
        fs.stat(directory, (error) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    fs.mkdir(directory, (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(directory);
                        }
                    });
                } else {
                    reject(error);
                }
            } else {
                resolve(directory);
            }
        });
    });
}

export const calculateAirportDistance = (departureAirportId, arrivalAirportId) => {
        cy.apiRequest('POST', '/calculation-variables/calculate/airport-distance',
            {
                departureAirportId: departureAirportId,
                arrivalAirportId: arrivalAirportId
            }).then(json => {
            expect(json.status).to.equals(200)
        })
            return cy.readFile('cypress/fixtures/generated_json_files/writeFileSuccess.json')
}

export const getAirportIds = () => {

   const airportIds = []
    cy.apiRequest('GET', '/calculation-variables/places?placeType=AIRPORT')
        .then(json => {
            expect(json.status).to.equals(200)
            cy.get(json.body.content).each(item => {
                airportIds.push(item.id)
            })
            cy.log(airportIds)
        })
    return airportIds
}








