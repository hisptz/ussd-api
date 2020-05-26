import {
  getCurrentSession,
  updateUserSession,
  addUserSession,
  getSessionDataValue,
  getMenuJson,
  getLatestApplicationEntryByKey
} from '../../db';
import { getDataStoreFromDHIS2 } from '../../endpoints/dataStore';
import { getOrganisationUnitByCode, getOrganisationUnitByLevel } from '../../endpoints/organisationUnit';
const { generateCode } = require('dhis2-uid');
import { generateCovidCode } from '../../endpoints/covidCode';
import * as _ from 'lodash';
import {
  collectData,
  submitData,
  completeForm,
  collectPeriodData,
  collectOrganisationUnitData,
  validatedData,
  ruleNotPassed,
  addMessage
} from './dataCollection';
import { getConfirmationSummarySummary } from './confirmationSummary';
import { getSanitizedErrorMessage } from './errorMessage';
import { getCode } from '../../endpoints/sqlViews';
import { appConfig } from '../../config/app.config';

const periodTypes = {
  Weekly: 'W',
  Monthly: '',
  BiMonthly: 'S',
  Quoterly: 'Q'
};

var id_gen_menu = {};

const numericalValueTypes = ['INTEGER_NEGATIVE', 'INTEGER_POSITIVE', 'INTEGER', 'NUMBER', 'INTEGER_ZERO_OR_POSITIVE'];
const menu_types_with_back = ['options', 'data', 'period'];
const dataSubmissionOptions = [true, false];
const successStatus = ['SUCCESS', 'OK'];
const OK = 'OK';

export const repeatingRequest = async (sessionid, USSDRequest, msisdn) => {
  //console.log('USSDRequest Input:', USSDRequest)
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
        msisdn: msisdn
      };

      await addUserSession(session_data);
      currentmenu = starting_menu.menu_id;
      retries = 0;
      response = {
        response_type: 2,
        text: starting_menu.title,
        options: returnOptions({ options: JSON.parse(starting_menu.options) })
      };

      return response;
    } else {
      currentmenu = session_details.currentmenu;
      application_id = session_details.application_id;
      retries = session_details.retries;
    }

    const _currentMenu = await getMenuJson(currentmenu, application_id);

    // checking for previous menu is not auth and checking if user need previous menu
    let _previous_menu = null;
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
      if (previous_menu) {
        response = await returnNextMenu(sessionid, _previous_menu);
      } else {
        esponse = await returnNextMenu(sessionid, _next_menu_json);
      }
    } else {
      if (_currentMenu.type === 'fetch') {
      } else if (_currentMenu.type === 'id_generator') {
        const { passed, correctOption, next_menu_response } = await checkOptionSetsAnswer(
          sessionid,
          id_gen_menu,
          _next_menu_json,
          USSDRequest
        );
        if (passed) {
          response = await collectData(sessionid, id_gen_menu, correctOption);
          if (next_menu_response) {
            response = next_menu_response;
          } else {
            response = await returnNextMenu(sessionid, _next_menu_json);
          }
        } else {
          const retry_message = _currentMenu.retry_message || 'You did not enter the correct choice, try again';
          response = await returnNextMenu(sessionid, _next_menu_json, retry_message);
        }
        response = checkOptionsAnswer(sessionid, id_gen_menu, USSDRequest, application_id, retries);
        //reset id gen menu
        id_gen_menu = {};
        response = await returnNextMenu(sessionid, _next_menu_json);
      } else if (_currentMenu.type === 'auth') {
        if (_currentMenu.number_of_retries && retries >= _currentMenu.number_of_retries) {
          response = {
            response_type: 1,
            text: _currentMenu.fail_message
          };
        } else {
          response = await checkAuthKey(sessionid, USSDRequest, _currentMenu, _next_menu_json, retries);
        }
      } else if (_currentMenu.type === 'data') {
        const options = JSON.parse(_currentMenu.options);
        if (options && options.length) {
          //console.log('test here', sessionid, 'current menu :::', _currentMenu, 'ussd req ::::', USSDRequest, 'menus :::', menus);

          const { passed, correctOption, next_menu_response } = await checkOptionSetsAnswer(
            sessionid,
            _currentMenu,
            _next_menu_json,
            USSDRequest
          );
          if (passed) {
            response = await collectData(sessionid, _currentMenu, correctOption);
            if (next_menu_response) {
              response = next_menu_response;
            } else {
              response = await returnNextMenu(sessionid, _next_menu_json);
            }
          } else {
            // Return menu for data collector with options
            const retry_message = _currentMenu.retry_message || 'Chaguo uliloingiza sio sahihi, jaribu tena';
            response = await returnNextMenu(sessionid, _currentMenu, retry_message);
          }
        } else {
          //come back to check here
          // checking for values types from current menu and value send from ussd
          if (_currentMenu.field_value_type && numericalValueTypes.includes(_currentMenu.field_value_type) && !isNumeric(USSDRequest)) {
            const retry_message = _currentMenu.retry_message || 'Chaguo uliloingiza sio sahihi, jaribu tena';
            response = await returnNextMenu(sessionid, _currentMenu, retry_message);
          } else {
            response = await collectData(sessionid, _currentMenu, USSDRequest);
            response = await returnNextMenu(sessionid, _next_menu_json);
          }
        }
      } else if (_currentMenu.type === 'options') {
        response = checkOptionsAnswer(sessionid, _currentMenu, USSDRequest, application_id, retries);
      } else if (_currentMenu.type === 'period') {
        response = await checkPeriodAnswer(sessionid, _currentMenu, USSDRequest, _next_menu_json);
      } else if (_currentMenu.type === 'ou') {
        response = await checkOrgUnitAnswer(sessionid, _currentMenu, _next_menu_json, USSDRequest);
      } else if (_currentMenu.type === 'ou_options') {
        response = await checkOrgUnitAnswerOptions(sessionid, _currentMenu, application_id, USSDRequest, retries);
      } else if (_currentMenu.type === 'message') {
        response = terminateWithMessage(sessionid, _currentMenu);
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
                  text: message
                };
              } else {
                //TODO :: change logic here to not send data but add to list of syncs
                const requestResponse = await submitData(sessionid, _currentMenu, msisdn, USSDRequest);

                response = await returnNextMenu(sessionid, _next_menu_json);
              }
            } else {
              response = {
                response_type: 1,
                text: 'Terminating the session'
              };
            }
          } else {
            const retry_message = _currentMenu.retry_message || 'You did not enter the correct choice, try again';
            response = await returnNextMenu(sessionid, _currentMenu, retry_message);
          }
        } else {
          const { httpStatus } = await submitData(sessionid, _currentMenu, msisdn, USSDRequest);
          if (httpStatus !== OK) {
            response = {
              response_type: 1,
              text: 'Terminating the session'
            };
          }
        }
      }
    }
  } catch (e) {
    console.log('error :: ', e);
    response = {
      response_type: 1,
      text: 'Server Error. Please try again.'
    };
  }
  return response;
};

const checkAuthKey = async (sessionid, response, currentMenu, _next_menu_json, retries) => {
  let message;
  const { next_menu, retry_message } = currentMenu;
  if (response === currentMenu.auth_key) {
    message = await returnNextMenu(sessionid, _next_menu_json);
  } else {
    await updateUserSession(sessionid, {
      retries: Number(retries) + 1
    });
    message = {
      response_type: 2,
      text: retry_message
    };
  }

  return message;
};

// Deals with next menu;
const returnNextMenu = async (sessionid, next_menu_json, additional_message) => {
  let message;

  await updateUserSession(sessionid, {
    currentmenu: next_menu_json.menu_id,
    retries: 0
  });
  const menu = next_menu_json;

  const _previous_menu = menu.previous_menu || '';
  //console.log('Menu Type:', menu.type);
  if (menu.type === 'options' || menu.type === 'ou_options') {
    message = {
      response_type: 2,
      text: menu.title,
      options: returnOptions({ options: JSON.parse(menu.options) })
    };
  } else if (menu.type === 'period' || menu.type === 'data') {
    const { use_for_year, years_back } = menu;
    if (use_for_year) {
      const arrayOfYears = getYears(years_back);
      const msg_str = [menu.title, ...arrayOfYears.map((year, index) => `${index + 1}. ${year}`)].join('\n');
      message = {
        response_type: 2,
        text: msg_str
      };
    } else {
      if (menu.options && menu.options.length) {
        message = {
          response_type: 2,
          text: menu.title,
          options: returnOptions({ options: JSON.parse(menu.options) })
        };
      } else {
        message = {
          response_type: 2,
          text: menu.title
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
      options: returnOptions({ options: JSON.parse(menu.options) })
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
      text: menu.title
    };
  } else if (menu.type === 'id_generator') {
    let session = await getCurrentSession(sessionid);

    // let orgUnitDetails = await getOrganisationUnit(session.orgUnit);

    // let code = await generateCode()

    let generatedId = await generateCovidCode();
    id_gen_menu = menu;
    id_gen_menu['options'] = [
      { id: '123', response: '1', title: ' tuma namba', value: generatedId.value, next_menu: id_gen_menu.next_menu }
    ];
    message = {
      response_type: 2,
      text: 'Bonyeza moja kutunza Numba ya Utambulisho kwenye mfumo<br/>' + generatedId.value,
      options: returnOptions(id_gen_menu)
    };
  } else if (menu.type == 'fetch') {
    //fetch event details
    // message = {
    //   response_type: 2,
    //   text: menu.title
    // };
  }
  // checking if previous menu is not of type auth and add back menu

  if (_previous_menu && _previous_menu.type !== 'auth' && menu_types_with_back.includes(menu.type)) {
    //message.text += `\n# Rudi`;
    message.text += ``;
  }

  if (additional_message) {
    message.text += `\n${additional_message}`;
  }

  return message;
};

// Option Answers.
const checkOptionsAnswer = async (sessionid, menu, answer, app_id, retries) => {
  const options = typeof menu.options == 'string' ? JSON.parse(menu.options) : menu.options;
  const responses = options.map(option => option.response);
  if (!responses.includes(answer)) {
    // return menu with options in case of incorrect value on selection
    if (menu.type === 'options' && menu.options) {
      await updateUserSession(sessionid, {
        retries: Number(retries) + 1
      });

      if (menu.number_of_retries && retries >= menu.number_of_retries) {
        return {
          response_type: 1,
          text: menu.fail_message
        };
      } else {
        return {
          response_type: 2,
          text: menu.title + '\n' + (menu.retry_message || 'Jibu lako sio sahihi, jaribu tena'),
          options: returnOptions({ options: options })
        };
      }
    } else {
      return {
        response_type: 1,
        text: `${menu.fail_message || 'Jibu lako sio sahihi'}`
      };
    }
  }

  const correctOption = options.filter(option => option.response === answer)[0];

  const { next_menu } = correctOption;

  let next_menu_json = await getMenuJson(next_menu, app_id);

  await updateUserSession(sessionid, {
    retries: 0
  });

  return await returnNextMenu(sessionid, next_menu_json);
};

// Option Answers.
const checkOptionSetsAnswer = async (sessionid, menu, _next_menu_json, answer) => {
  const options = typeof menu.options == 'string' ? JSON.parse(menu.options) : menu.options;
  const responses = options.map(option => option.response);
  let passed = true;
  let correctOption = null;
  let next_menu_response = null;
  if (!responses.includes(answer)) {
    passed = !passed;
  } else {
    const { value, next_menu } = options.filter(option => option.response === answer)[0];
    if (next_menu) {
      next_menu_response = await returnNextMenu(sessionid, _next_menu_json);
    }
    correctOption = value;
  }
  return {
    passed,
    correctOption,
    next_menu_response
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
const returnOptions = ({ options }) => {
  let returnOptions = {};

  console.log('options at for each', options);
  options.forEach(option => {
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
  response = await returnNextMenu(sessionid, _next_menu_json);
  //checking for period value and return appropriate menu in case of wrong selection
  if (isNumeric(answer)) {
    //checking for yearly period types
    if (use_for_year) {
      const limit = parseInt(years_back, 10) + 1;
      if (answer > 0 && answer <= limit) {
        const year = getYears(years_back)[answer - 1];
        await collectPeriodData(sessionid, {
          year
        });
      } else {
        const retry_message = menu.retry_message || `You did not enter the correct choice`;
        response = await returnNextMenu(sessionid, menu, retry_message);
      }
    } else {
      //checking for validity of values for other priod types
      if (answer > 0 && maximum_value && answer <= maximum_value) {
        const period_value = getPeriodBytype(period_type, answer);
        const period =
          period_type === 'BiMonthly' ? `${period_value}${periodTypes[period_type]}` : `${periodTypes[period_type]}${period_value}`;
        await collectPeriodData(sessionid, {
          period
        });
      } else {
        const retry_message = `${answer} is out range of 1 to ${maximum_value}, try again`;
        response = await returnNextMenu(sessionid, menu, retry_message);
      }
    }
  } else {
    const retry_message = menu.retry_message || `You did not enter numerical value, try again`;
    response = await returnNextMenu(sessionid, menu, retry_message);
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
        response = await returnNextMenu(sessionid, _next_menu_json, ruleHasNotPassed.errorMessage);
      }
    } else {
      const results = await getOrganisationUnitByCode(answer);
      if (results.organisationUnits.length > 0) {
        const orgUnit = results.organisationUnits[0].id;
        await collectOrganisationUnitData(sessionid, {
          orgUnit
        });
        response = await returnNextMenu(sessionid, _next_menu_json);
      } else {
        const retry_message = menu.retry_message || `You did not enter a valid code, try again`;
        response = await returnNextMenu(sessionid, menu.id, retry_message);
      }
    }
  } else {
    response = await returnNextMenu(sessionid, _next_menu_json);
  }

  return response;
};

const checkOrgUnitAnswerOptions = async (sessionid, menu, application_id, answer, retries) => {
  var options = JSON.parse(menu.options).filter(option => option.response == answer);
  console.log('returned options', options);

  if (options.length == 0) {
    await updateUserSession(sessionid, {
      retries: Number(retries) + 1
    });

    if (menu.number_of_retries && retries >= menu.number_of_retries) {
      return {
        response_type: 1,
        text: menu.fail_message || 'Umekosea mara 3, tafadhali anza upya'
      };
    } else {
      return {
        response_type: 2,
        text: menu.title + '\n' + (menu.retry_message || 'Jibu lako sio sahihi, jaribu tena'),
        options: returnOptions({ options: JSON.parse(menu.options) })
      };
    }
  } else {
    await collectOrganisationUnitData(sessionid, {
      orgUnit: options[0].value
    });
    return await returnNextMenu(sessionid, await getMenuJson(options[0].next_menu, application_id));
  }
};

const getPeriodBytype = (period_type, value) => {
  return period_type === 'Monthly' ? (value > 9 ? `${value}` : `0${value}`) : value;
};

const terminateWithMessage = async (sessionid, menu) => {
  // TODO: DO other things like deleting session. not to overcloud database.

  let data = await getSessionDataValue(sessionid);

  //specific message for addo referral confimation menu
  let referenceNumber;
  //console.log('data on repeating req', data);
  if (data.datatype === 'event') {
    referenceNumber = _.find(data.dataValues.dataValues, dataValue => {
      return dataValue.dataElement == 'KlmXMXitsla';
    }).value;
  } else if (data.datatype === 'tracker') {
    //console.log('data on repeating req', data.dataValues.attributes);
    referenceNumber = _.find(data.dataValues.attributes, dataValue => {
      return dataValue.attribute == 'iaNdifmweXr';
    })
      ? _.find(data.dataValues.attributes, dataValue => {
          return dataValue.attribute == 'iaNdifmweXr';
        }).value
      : '';
  }

  //end of specific menu for referral confirmation menu

  let message = menu.title;
  message = message.split('${ref_number}').join(referenceNumber);

  return {
    response_type: 1,
    //text: 'message like this'
    text: message
  };
};

const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const getYears = years_back => {
  const currentYear = new Date().getFullYear();
  const arrayOfYears = [];
  for (let index = 0; index <= years_back; index++) {
    const year = currentYear - index;
    arrayOfYears.push(year);
  }

  return arrayOfYears;
};
