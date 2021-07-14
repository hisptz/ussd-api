import {
  getCurrentSession,
  updateUserSession,
  addUserSession,
  getSessionDataValue,
  getMenuJson,
  getLatestApplicationEntryByKey,
  getOutlierByDatasetPeriodAndOu,
  addOulier,
} from '../../db';
import { getOrganisationUnitByCode, getOrganisationUnit } from '../../endpoints/organisationUnit';
import { getDataSetOutliers, getDataSet, getDataSetValidationRules, validationRulesEval } from '../../endpoints/dataSet';
const { generateCode } = require('dhis2-uid');
import * as _ from 'lodash';
import {
  collectData,
  submitData,
  completeForm,
  collectPeriodData,
  collectOrganisationUnitData,
  validatedData,
  ruleNotPassed,
  addMessage,
} from './dataCollection';
import { getConfirmationSummarySummary } from './confirmationSummary';
import { getSanitizedErrorMessage } from './errorMessage';
import { getCode } from '../../endpoints/sqlViews';
import { appConfig } from '../../config/app.config';

const periodTypes = {
  Weekly: 'W',
  Monthly: '',
  BiMonthly: 'S',
  Quoterly: 'Q',
};

const operatorMapper = {
  equal_to: '==',
  not_equal_to: '!==',
  greater_than: '>',
  greater_than_or_equal_to: '>=',
  less_than: '<',
  less_than_or_equal_to: '<=',
};

let dataSetConfigs;
let dataElementShortNames = {};

const getDataSetDataElementsIds = async () => {
  let metadata = await getDataSet(`NDcgQeGaJC9`);

  _.each(
    _.filter(metadata.dataSetElements, (de) => {
      if (de.dataElement) {
        return true;
      } else {
        return false;
      }
    }),
    (filteredDe) => {
      dataElementShortNames[filteredDe.dataElement.id] = filteredDe.dataElement.shortName;
    }
  );

  dataSetConfigs = metadata.dataEntryForm.htmlCode
    .split('id="')
    .filter((y) => y.includes('-val'))
    .map((z) => {
      let q = z.split('-');
      if (q.length > 2) {
        return `${q[0]}-${q[1]}`;
      } else {
        return null;
      }
    });
};

getDataSetDataElementsIds();

var id_gen_menu = {};

const numericalValueTypes = ['INTEGER_NEGATIVE', 'INTEGER_POSITIVE', 'INTEGER', 'NUMBER', 'INTEGER_ZERO_OR_POSITIVE'];
const menu_types_with_back = ['options', 'data', 'period'];
const dataSubmissionOptions = [true, false];
const successStatus = ['SUCCESS', 'OK'];
const OK = 'OK';

export const repeatingRequest = async (sessionid, USSDRequest, msisdn, session) => {
  let response;
  try {
    let currentmenu, retries, application_id;
    const session_details = await getCurrentSession(sessionid);

    if (!session_details) {
      const application_data = await getLatestApplicationEntryByKey(appConfig.dataStoreId);
      application_id = application_data.id;
      const starting_menu = await getMenuJson(application_data.starting_menu, application_id);
      const id = generateCode();
      const session_data = {
        id,
        sessionid,
        currentmenu: starting_menu.menu_id,
        retries: 0,
        done: false,
        started: new Date(),
        application_id: application_id,
        msisdn: msisdn,
      };

      await addUserSession(session_data);
      currentmenu = starting_menu.menu_id;
      retries = 0;
      response = {
        response_type: 2,
        text: starting_menu.title,
        options: returnOptions({ options: JSON.parse(starting_menu.options) }),
      };

      return response;
    } else {
      currentmenu = session_details.currentmenu;
      application_id = session_details.application_id;
      retries = session_details.retries;
    }

    const _currentMenu = await getMenuJson(currentmenu, application_id);

    // checking for previous menu is not auth and checking if user need previous menu
    let _previous_menu = {};
    let _next_menu_json = {};

    if (_currentMenu.previous_menu !== '') {
      _previous_menu = await getMenuJson(_currentMenu.previous_menu, application_id);
    }

    if (_currentMenu.next_menu !== '') {
      _next_menu_json = await getMenuJson(_currentMenu.next_menu, application_id);
    }

    // checking for previous menu is not auth and checking if user need previous menu
    if (_previous_menu && _previous_menu.type !== 'auth' && USSDRequest === '#' && menu_types_with_back.includes(_currentMenu.type)) {
      //response = await returnNextMenu(sessionid, _currentMenu.previous_menu, menus);
      response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
    } else {
      // console.log("MENU 12 :: ", _currentMenu)

      if (_currentMenu.type === 'fetch') {
      } else if (_currentMenu.type === 'id_generator') {
        const { passed, correctOption, next_menu_response } = await checkOptionSetsAnswer(
          sessionid,
          id_gen_menu,
          _next_menu_json,
          USSDRequest,
          application_id
        );
        if (passed) {
          response = await collectData(sessionid, id_gen_menu, correctOption);

          if (next_menu_response) {
            response = next_menu_response;
          } else {
            response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
          }
        } else {
          const retry_message = _currentMenu.retry_message || 'You did not enter the correct choice, try again';
          response = await returnNextMenu(sessionid, _next_menu_json, retry_message, session.orgUnit);
        }
        response = checkOptionsAnswer(sessionid, id_gen_menu, USSDRequest, application_id);
        //reset id gen menu
        id_gen_menu = {};
        response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
      } else if (_currentMenu.type === 'auth') {
        // console.log('here on auth menu');
        if (_currentMenu.number_of_retries && retries >= _currentMenu.number_of_retries) {
          response = {
            response_type: 1,
            text: _currentMenu.fail_message,
          };
        } else {
          response = await checkAuthKey(sessionid, USSDRequest, _currentMenu, _next_menu_json, retries);
        }
      } else if (_currentMenu.type === 'data') {
        const options = JSON.parse(_currentMenu.options);

        const ruleHasNtPassed = await ruleNotPassed(sessionid, _currentMenu, USSDRequest);

        if (ruleHasNtPassed && ruleHasNtPassed.type == 'ERROR') {
          response = await returnNextMenu(sessionid, _currentMenu, ruleHasNtPassed.errorMessage, session.orgUnit);

          return response;
        } else if (options && options.length) {
          //console.log('test here', sessionid, 'current menu :::', _currentMenu, 'ussd req ::::', USSDRequest, 'menus :::', menus);

          const { passed, correctOption, next_menu_response } = await checkOptionSetsAnswer(
            sessionid,
            _currentMenu,
            _next_menu_json,
            USSDRequest,
            application_id
          );

          if (passed) {
            response = await collectData(sessionid, _currentMenu, correctOption);

            // console.log('next menu res :: ', correctOption);

            if (next_menu_response) {
              response = next_menu_response;
            } else {
              response = await returnNextMenu(sessionid, _next_menu_json);
            }
          } else {
            // Return menu for data collector with options
            const retry_message = _currentMenu.retry_message || 'You did not enter the correct choice, try again';
            response = await returnNextMenu(sessionid, _next_menu_json, retry_message);
          }
        } else {
          // checking for values types from current menu and value send from ussd
          if (_currentMenu.field_value_type && numericalValueTypes.includes(_currentMenu.field_value_type) && !isNumeric(USSDRequest)) {
            const retry_message = _currentMenu.retry_message || 'You did not enter numerical value, try again';
            response = await returnNextMenu(sessionid, _next_menu_json, retry_message, session.orgUnit);
          } else {
            let dataValues = await getSessionDataValue(sessionid);

            let periodId = `${dataValues.year}${dataValues.period}`;


            // check if menu is dataset, session has period and ou
            if (
              _currentMenu.data_set &&
              session.orgUnit &&
              periodId &&
              !(session.current_menu_action && session.current_menu_action == 'RESUBMIT_TO_VALIDATE')
            ) {
              // check if outlier exists in db

              let outlierData = await getOutlierByDatasetPeriodAndOu(_currentMenu.data_set, session.orgUnit, periodId);

              if (outlierData) {
                // check against the data
                let outliersObject = outlierData.outliers;


                if (outliersObject[_currentMenu.data_id.split('.').join('-')]) {
                  if (
                    outliersObject[_currentMenu.data_id.split('.').join('-')]['min'] >= USSDRequest ||
                    outliersObject[_currentMenu.data_id.split('.').join('-')]['max'] <= USSDRequest
                  ) {
                    // outlier exists
                    // create virtual outlier notification menu to allow reentry na warning

                    await updateUserSession(sessionid, { ...session, current_menu_action: 'RESUBMIT_TO_VALIDATE' });

                    let menuToReturn = {
                      ..._currentMenu,
                      options: `[{"id": "6hzlZcW0Sad","title": "Confirm","response": "1", "value": "${USSDRequest}", "next_menu":"${_currentMenu.next_menu}"}]`,
                    };

                    response = returnNextMenu(
                      sessionid,
                      menuToReturn,
                      `The value is an not within exeptable range. Re-enter the value to confirm, or enter a new value to update`,
                      session.orgUnit
                    );
                  } else {
                    // no outlier, proceed

                    response = await collectData(sessionid, _currentMenu, USSDRequest);
                    response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
                  }
                } else {
                  // no outlier, proceed

                  response = await collectData(sessionid, _currentMenu, USSDRequest);
                  response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
                }
              } else {
                // get outliers from api
                let outliersFromAPI = await getDataSetOutliers(_currentMenu.data_set, periodId, session.orgUnit);

                //transform to good format
                let outliersObject = {};
                _.each(outliersFromAPI.minMaxDataElements, (deRange) => {
                  outliersObject[deRange.id] = {
                    min: deRange.min,
                    max: deRange.max,
                  };
                });

                //feed outlierdata to db
                await addOulier({
                  dataset: _currentMenu.data_set,
                  period: periodId,
                  orgUnit: session.orgUnit,
                  outliers: outliersObject,
                });

                // check against data

                if (outliersObject[_currentMenu.data_id.split('.').join('-')]) {
                  if (
                    outliersObject[_currentMenu.data_id.split('.').join('-')]['min'] >= USSDRequest ||
                    outliersObject[_currentMenu.data_id.split('.').join('-')]['max'] <= USSDRequest
                  ) {
                    // outlier exists
                    // create virtual outlier notification menu to allow reentry na warning
                    menuToReturn = {
                      ..._currentMenu,
                      options: [
                        {
                          id: '6hzlZcW0Sad',
                          title: 'Confirm',
                          response: '1',
                          value: USSDRequest,
                        },
                      ],
                    };

                    response = returnNextMenu(sessionid, menuToReturn, 'error message', session.orgUnit);
                  } else {
                    // no outlier, proceed

                    response = await collectData(sessionid, _currentMenu, USSDRequest);
                    response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
                  }
                } else {
                  // no outlier, proceed

                  response = await collectData(sessionid, _currentMenu, USSDRequest);
                  response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
                }
              }
            } else {
              if (session.current_menu_action && session.current_menu_action == 'RESUBMIT_TO_VALIDATE') {
                await updateUserSession(sessionid, { ...session, current_menu_action: null });
              }

              response = await collectData(sessionid, _currentMenu, USSDRequest);
              response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
            }
          }
        }
      } else if (_currentMenu.type === 'options') {
        response = await checkOptionsAnswer(sessionid, _currentMenu, USSDRequest, application_id);
      } else if (_currentMenu.type === 'period') {
        response = await checkPeriodAnswer(sessionid, _currentMenu, USSDRequest, _next_menu_json);
      } else if (_currentMenu.type === 'ou') {
        response = await checkOrgUnitAnswer(sessionid, _currentMenu, _next_menu_json, USSDRequest);
      } else if (_currentMenu.type === 'message') {
        response = terminateWithMessage(sessionid, _currentMenu);
      } else if (_currentMenu.type === 'outliers') {
        response = await checkOptionsAnswer(sessionid, _currentMenu, USSDRequest, application_id);
      } else if (_currentMenu.type === 'dataset-summary') {
        response = await checkOptionsAnswer(sessionid, _currentMenu, USSDRequest, application_id);
      }

      //data to be submitted here
      if (_currentMenu.submit_data) {
        if ((_currentMenu.type = 'data-submission')) {
          if (USSDRequest <= dataSubmissionOptions.length) {
            if (dataSubmissionOptions[USSDRequest - 1]) {
              const validation = await validatedData(sessionid, _currentMenu);
              if (validation.notSet.length > 0) {
                const message = 'The following data is not entered:' + validation.notSet.join(',');
                response = {
                  response_type: 1,
                  text: message,
                };
              } else {
                //TODO :: change logic here to not send data but add to list of syncs
                const requestResponse = await submitData(sessionid, _currentMenu, msisdn, USSDRequest);

                response = await returnNextMenu(sessionid, _next_menu_json, null, session.orgUnit);
              }
            } else {
              response = {
                response_type: 1,
                text: 'Terminating the session',
              };
            }
          } else {
            const retry_message = _currentMenu.retry_message || 'You did not enter the correct choice, try again';
            response = await returnNextMenu(sessionid, _currentMenu, retry_message, session.orgUnit);
          }
        } else {
          const { httpStatus } = await submitData(sessionid, _currentMenu, msisdn, USSDRequest);
          if (httpStatus !== OK) {
            response = {
              response_type: 1,
              text: 'Terminating the session',
            };
          }
        }
      }
    }
  } catch (e) {
    response = {
      response_type: 1,
      text: 'Server Error. Please try again.',
    };
    console.log(e);
  }
  return response;
};

const checkAuthKey = async (sessionid, response, currentMenu, _next_menu_json, retries) => {
  let message;
  const { next_menu, retry_message } = currentMenu;
  if (response === currentMenu.auth_key) {
    message = await returnNextMenu(sessionid, _next_menu_json, null, null);
  } else {
    await updateUserSession(sessionid, {
      retries: Number(retries) + 1,
    });
    message = {
      response_type: 2,
      text: retry_message,
    };
  }

  return message;
};

// Deals with next menu;
const returnNextMenu = async (sessionid, next_menu_json, additional_message, orgUnit) => {
  let message;

  await updateUserSession(sessionid, {
    currentmenu: next_menu_json.menu_id,
    retries: 0,
  });
  const menu = next_menu_json;

  const _previous_menu = menu.previous_menu || '';

  if (menu.type === 'options') {
    message = {
      response_type: 2,
      text: menu.title,
      options: returnOptions({ options: JSON.parse(menu.options) }),
    };
  } else if (menu.type === 'period' || menu.type === 'data') {
    const { use_for_year, years_back } = menu;
    if (use_for_year) {
      const arrayOfYears = getYears(years_back);
      const msg_str = [menu.title, ...arrayOfYears.map((year, index) => `${index + 1}. ${year}`)].join('\n');
      message = {
        response_type: 2,
        text: msg_str,
      };
    } else {
      if (menu.options && menu.options.length) {
        message = {
          response_type: 2,
          text: menu.title,
          options: returnOptions({ options: JSON.parse(menu.options) }),
        };
      } else {
        message = {
          response_type: 2,
          text: menu.title,
        };
      }
    }
  } else if (menu.type === 'message') {
    message = await terminateWithMessage(sessionid, menu);
  } else if (menu.type === 'data-submission') {
    const connfirmationSummary = await getConfirmationSummarySummary(sessionid, menu.application_id);
    //console.log('confirm menu :: ', connfirmationSummary);
    const submitOptions = ['YES', 'NO'];
    //const submitMsgString = [menu.title, ...submitOptions.map((option, index) => `${index + 1}. ${option}`)].join('\n');

    message = {
      response_type: 2,
      text: menu.title,
      options: returnOptions({ options: JSON.parse(menu.options) }),
      /*options: {
        '1': 'Kutuma',
        '2': 'Kukataa'
      }*/
    };
    if (menu.show_confirmation_summary) {
      message.text += `\n${connfirmationSummary}`;
    }
  } else if (menu.type === 'ou') {
    message = {
      response_type: 2,
      text: menu.title,
    };
  } else if (menu.type === 'id_generator') {
    let session = await getCurrentSession(sessionid);

    let orgUnitDetails = await getOrganisationUnit(session.orgUnit);

    let code = await getCode(orgUnitDetails.code);

    let generatedId = orgUnitDetails.code + '' + code.listGrid.rows[0][0];
    id_gen_menu = menu;
    id_gen_menu['options'] = [
      { id: '123', response: '1', title: ' tuma id', value: generatedId.toString(), next_menu: id_gen_menu.next_menu },
    ];
    message = {
      response_type: 2,
      text: 'Bonyeza moja kutunza ID ya rufaa kwenye mfumo<br/>' + generatedId,
      options: returnOptions(id_gen_menu),
    };
  } else if (menu.type == 'fetch') {
    //fetch event details
    // message = {
    //   response_type: 2,
    //   text: menu.title
    // };
  } else if (menu.type == 'outliers') {
    let dataValues = await getSessionDataValue(sessionid);

    let session = await getCurrentSession(sessionid);

    let dataSetMetaData = await getDataSet(menu.data_set);

    let dataElemsShortNames = {};

    _.each(dataSetMetaData.dataSetElements, (dataElement) => {
      dataElemsShortNames[dataElement.dataElement.id] = dataElement.dataElement.shortName;
    });

    let periodId = `${dataValues.year}${dataValues.period}`;
    let dataElementsMinMax = await getDataSetOutliers(menu.data_set, periodId, session.orgUnit);

    let outliersList = getOutliersList(dataValues.dataValues, dataElementsMinMax.minMaxDataElements, dataElemsShortNames);

    let text;

    if (outliersList.length > 0) {
      text = `Outliers exist in the following data: \n ${_.uniq(
        _.map(outliersList, (outlier) => {
          return outlier.shortName;
        })
      ).join(', ')} \n You may repeat data entry or proceed to data validation \n`;
    } else {
      text = `There are no outliers, you may proceed.`;
    }

    message = {
      response_type: 2,
      text: text,
      options: returnOptions({ options: JSON.parse(menu.options) }),
    };
  } else if (menu.type === 'dataset-summary') {
    // get dataset dataelements
    let session = await getCurrentSession(sessionid);

    console.log('session :: ', session);

    let dataValues = await getSessionDataValue(sessionid);

    console.log('data values :: ', dataValues);

    let periodId = `${dataValues.year}${dataValues.period}`;

    let dataElements = await getDataSetOutliers(menu.data_set, periodId, session.orgUnit);

    // get datavalues
    let actualDataValues = dataElements.dataValues;

    // compare dataset with datavalues
    let comparedDataElementsWithDataValues = await compareDataElementsWithDataValues(dataElements, actualDataValues);

    let text;

    if (comparedDataElementsWithDataValues.length > 0) {
      text = `You can not submit this form, the following data has not been captured:  \n ${comparedDataElementsWithDataValues.join(', ')}`;

      message = {
        response_type: 2,
        text: text,
      };
    } else {
      // skip menu;
      let appData = await getLatestApplicationEntryByKey(appConfig.dataStoreId);
      let appId = appData.id;

      let menuToSkipTo = await getMenuJson(menu.next_menu, appId);

      message = await returnNextMenu(sessionid, menuToSkipTo);

      // message = {
      //   response_type: 2,
      //   text: text,
      //   options: returnOptions({ options: JSON.parse(menu.options) }),
      // };
    }
  } else if (menu.type === 'dataset-validation') {
    console.log('MENU :: ', menu);

    // get dataset dataelements
    let session = await getCurrentSession(sessionid);

    console.log('session :: ', session);

    let dataValues = await getSessionDataValue(sessionid);

    // console.log('data values :: ', dataValues);

    let periodId = `${dataValues.year}${dataValues.period}`;

    let validationRules = await getDataSetValidationRules(menu.data_set);

    let dataSetDataValues = await getDataSetOutliers(menu.data_set, periodId, session.orgUnit);

    // console.log('rules :: ', validationRules);

    let evaluations = await evaluateValidationRules(validationRules.validationRules, dataSetDataValues.dataValues);

    console.log('evaluations length :: ', evaluations.length);
    console.log('eval :: ', JSON.stringify(evaluations, null, 4));

    let text;

    if (evaluations.length > 0) {
      text = `${evaluations.join(' \n')}`;

      message = {
        response_type: 2,
        text: text,
      };
    } else {
    }
  }

  // checking if previous menu is not of type auth and add back menu

  if (_previous_menu && _previous_menu.type !== 'auth' && menu_types_with_back.includes(menu.type)) {
    message.text += `\n# Rudi`;
  }

  if (additional_message) {
    message.text += `\n${additional_message}`;
  }

  return message;
};

const evaluateValidationRules = async (validationRules, dataValues) => {
  let dataValuesObject = {};
  _.each(dataValues, (datavalue) => {
    dataValuesObject[datavalue.id] = datavalue.val;
  });

  let violatedValidationRules = [];

  let expressions = _.each(validationRules, (vrule) => {
    console.log('vrule :: ', vrule);

    let leftSideVarsAndOperators = vrule.leftSide.expression.split(`#{`).join('').split('}');

    leftSideVarsAndOperators = _.map(leftSideVarsAndOperators, (variable) => {
      if (dataValuesObject && dataValuesObject[variable.split('.').join('-')]) {
        return dataValuesObject[variable.split('.').join('-')];
      } else {
        return variable;
      }
    }).join(' ');

    let rightSideVarsAndOperators = vrule.rightSide.expression.split(`#{`).join('').split('}');

    rightSideVarsAndOperators = _.map(rightSideVarsAndOperators, (variable) => {
      if (dataValuesObject && dataValuesObject[variable.split('.').join('-')]) {
        return dataValuesObject[variable.split('.').join('-')];
      } else {
        return variable;
      }
    }).join(' ');

    let expression = `${leftSideVarsAndOperators} ${operatorMapper[vrule.operator]} ${rightSideVarsAndOperators}`;

    console.log('exp :: ', expression);

    if (!eval(expression)) {
      violatedValidationRules.push(vrule.name);
    }
  });

  return violatedValidationRules;
};

const compareDataElementsWithDataValues = (dataValues) => {
  console.log('dataValues :: ', dataValues);

  console.log('shortNames :: ', dataElementShortNames);

  let missingDataElementsIds = [];

  let dataValuesObject = {};

  dataValues.dataValues.forEach((datavalue) => {
    dataValuesObject[datavalue.id] = datavalue.val;
  });

  dataSetConfigs.forEach((dataElement) => {
    if (dataValuesObject[dataElement]) {
      // missingDataElementsIds.push()
    } else {
      let de = dataElement.split('-');

      if (de.length > 0) {
        missingDataElementsIds.push(de[0]);
      }
    }
  });

  missingDataElementsIds = _.uniq(missingDataElementsIds);

  console.log('missing des :: ', missingDataElementsIds);
  return [
    ..._.map(missingDataElementsIds, (id) => {
      return dataElementShortNames[id];
    }),
  ];
};

const getOutliersList = (dataValues, maxMin, deShortNames) => {
  let processedDataValues = _.map(dataValues, (dv) => {
    let max = _.filter(maxMin, (range) => {
      if (range.id == `${dv.dataElement}-${dv.categoryOptionCombo}`) {
        return true;
      } else {
        return false;
      }
    });

    if (max.length > 0) {
      return { ...dv, max: max[0].max, min: max[0].min, shortName: deShortNames[dv.dataElement] };
    } else {
      return { ...dv, shortName: deShortNames[dv.dataElement] };
    }
  });

  let deOutliers = _.filter(processedDataValues, (deToCheckOutlier) => {
    if (
      deToCheckOutlier.max &&
      deToCheckOutlier.max &&
      (parseInt(deToCheckOutlier.max) < parseInt(deToCheckOutlier.value) ||
        parseInt(deToCheckOutlier.min) > parseInt(deToCheckOutlier.value))
    ) {
      return true;
    } else {
      return false;
    }
  });

  return deOutliers;
};

// Option Answers.
const checkOptionsAnswer = async (sessionid, menu, answer, app_id) => {
  const options = typeof menu.options == 'string' ? JSON.parse(menu.options) : menu.options;
  const responses = options.map((option) => option.response);
  if (!responses.includes(answer)) {
    // return menu with options in case of incorrect value on selection
    if (menu.type === 'options' && menu.options) {
      return {
        response_type: 2,
        text: menu.title + '\n' + (menu.retry_message || 'You did not enter the correct choice,try again'),
        options: returnOptions({ options: options }),
      };
    } else {
      return {
        response_type: 1,
        text: `${menu.fail_message || 'You did not enter the correct choice'}`,
      };
    }
  }

  const correctOption = options.filter((option) => option.response === answer)[0];

  const { next_menu } = correctOption;

  let next_menu_json = await getMenuJson(next_menu, app_id);

  // console.log('correctOption :: ', correctOption);
  // console.log('menu id :: ', next_menu);
  // console.log('menu json :: ', next_menu_json);

  return await returnNextMenu(sessionid, next_menu_json, null, null);
};

// Option Answers.
const checkOptionSetsAnswer = async (sessionid, menu, _next_menu_json, answer, app_id) => {
  const options = typeof menu.options == 'string' ? JSON.parse(menu.options) : menu.options;
  const responses = options.map((option) => option.response);
  let passed = true;
  let correctOption = null;
  let next_menu_response = null;
  if (!responses.includes(answer)) {
    passed = !passed;
  } else {
    const { value, next_menu } = options.filter((option) => option.response === answer)[0];
    if (next_menu) {
      _next_menu_json = await getMenuJson(next_menu, app_id);
      next_menu_response = await returnNextMenu(sessionid, _next_menu_json, null, null);
    } else {
      next_menu_response = await returnNextMenu(sessionid, _next_menu_json, null, null);
    }
    correctOption = value;
  }
  return {
    passed,
    correctOption,
    next_menu_response,
  };
};

// const returnOptions = ({
//   title,
//   options
// }) => {
//   return [title, ...options.map(({
//     response,
//     title
//   }) => `${response}. ${title}`)].join('\n');
// };
export const returnOptions = ({ options }) => {
  let returnOptions = {};
  options.forEach((option) => {
    if (typeof option.response === 'boolean') {
      returnOptions[option.response ? '1' : '2'] = option.title;
    } else {
      returnOptions[option.response] = option.title;
    }
  });
  return returnOptions;
};
// check Period answer
const checkPeriodAnswer = async (sessionid, menu, answer, _next_menu_json) => {
  let response;

  const { period_type, maximum_value, use_for_year, years_back } = menu;
  //checking for period value and return appropriate menu in case of wrong selection
  if (isNumeric(answer)) {
    //checking for yearly period types
    if (use_for_year) {
      const limit = parseInt(years_back, 10) + 1;
      if (answer > 0 && answer <= limit) {
        const year = getYears(years_back)[answer - 1];
        await collectPeriodData(sessionid, {
          year,
        });

        response = await returnNextMenu(sessionid, _next_menu_json, null, null);
      } else {
        const retry_message = menu.retry_message || `You did not enter the correct choice`;
        response = await returnNextMenu(sessionid, menu, retry_message, null);
      }
    } else {
      //checking for validity of values for other priod types
      if (answer > 0 && maximum_value && answer <= maximum_value) {
        const period_value = getPeriodBytype(period_type, answer);
        const period =
          period_type === 'BiMonthly' ? `${period_value}${periodTypes[period_type]}` : `${periodTypes[period_type]}${period_value}`;
        await collectPeriodData(sessionid, {
          period,
        });

        response = await returnNextMenu(sessionid, _next_menu_json, null, null);
      } else {
        const retry_message = `${answer} is out range of 1 to ${maximum_value}, try again`;
        response = await returnNextMenu(sessionid, menu, retry_message, null);
      }
    }
  } else {
    const retry_message = menu.retry_message || `You did not enter numerical value, try again`;
    response = await returnNextMenu(sessionid, menu, retry_message, null);
  }

  return response;
};

const checkOrgUnitAnswer = async (sessionid, menu, _next_menu_json, answer) => {
  let response;
  const { period_type, maximum_value, next_menu, use_for_year, years_back } = menu;
  //checking for period value and return appropriate menu in case of wrong selection
  if (isNumeric(answer)) {
    const ruleHasNotPassed = await ruleNotPassed(sessionid, menu, answer);

    if (ruleHasNotPassed) {
      if (ruleHasNotPassed.type === 'ERROR') {
        response = await returnNextMenu(sessionid, _next_menu_json, ruleHasNotPassed.errorMessage, null);
      }
    } else {
      const results = await getOrganisationUnitByCode(answer);
      if (results.organisationUnits.length > 0) {
        const orgUnit = results.organisationUnits[0].id;
        await collectOrganisationUnitData(sessionid, {
          orgUnit,
        });
        response = await returnNextMenu(sessionid, _next_menu_json, null, null);
      } else {
        const retry_message = menu.retry_message || `You did not enter a valid code, try again`;
        response = await returnNextMenu(sessionid, menu.id, retry_message, null);
      }
    }
  } else {
    response = await returnNextMenu(sessionid, _next_menu_json, null, null);
  }

  return response;
};

const getPeriodBytype = (period_type, value) => {
  return period_type === 'Monthly' ? (value > 9 ? `${value}` : `0${value}`) : value;
};

const terminateWithMessage = async (sessionid, menu) => {
  // TODO: DO other things like deleting session. not to overcloud database.

  let data = await getSessionDataValue(sessionid);

  //specific message for addo referral confimation menu
  let referenceNumber;
  if (data.datatype === 'event') {
    referenceNumber = _.find(data.dataValues.dataValues, (dataValue) => {
      return dataValue.dataElement == 'KlmXMXitsla';
    })
      ? _.find(data.dataValues.dataValues, (dataValue) => {
          return dataValue.dataElement == 'KlmXMXitsla';
        }).value
      : null;
  }

  //end of specific menu for referral confirmation menu

  let message = menu.title;
  message = message.split('${ref_number}').join(referenceNumber);

  return {
    response_type: 1,
    //text: 'message like this'
    text: message,
  };
};

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const getYears = (years_back) => {
  const currentYear = new Date().getFullYear();
  const arrayOfYears = [];
  for (let index = 0; index <= years_back; index++) {
    const year = currentYear - index;
    arrayOfYears.push(year);
  }

  return arrayOfYears;
};
