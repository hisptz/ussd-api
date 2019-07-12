import {
  getCurrentSession,
  updateUserSession,
  addUserSession
} from '../../db';
import {
  getDataStoreFromDHIS2
} from '../../endpoints/dataStore';
import {
  getOrganisationUnitByCode
} from '../../endpoints/organisationUnit';
const {
  generateCode
} = require('dhis2-uid');
import {
  collectData,
  submitData,
  completeForm,
  collectPeriodData,
  collectOrganisationUnitData,
  validatedData,
  ruleNotPassed
} from './dataCollection';
import {
  getConfirmationSummarySummary
} from './confirmationSummary';
import {
  getSanitizedErrorMessage
} from './errorMessage';
// Deals with curren menu.

const periodTypes = {
  Weekly: 'W',
  Monthly: '',
  BiMonthly: 'S',
  Quoterly: 'Q'
};
const numericalValueTypes = ['INTEGER_NEGATIVE',
  'INTEGER_POSITIVE',
  'INTEGER',
  'NUMBER',
  'INTEGER_ZERO_OR_POSITIVE'
];
const menu_types_with_back = ['options', 'data', 'period'];
const dataSubmissionOptions = [true, false];
const successStatus = ['SUCCESS', 'OK']
const OK = 'OK';

export const repeatingRequest = async (sessionid, USSDRequest, msisdn) => {
  console.log('USSDRequest Input:', USSDRequest);
  let response;
  try{
    let currentmenu, datastore, retries;
    const session_details = await getCurrentSession(sessionid);

    if (!session_details){
      const dataStore = await getDataStoreFromDHIS2();
      const {
        settings,
        menus
      } = dataStore;
      const starting_menu = menus[settings.starting_menu];
      const id = generateCode();
      const session_data = {
        id,
        sessionid,
        currentmenu: starting_menu.id,
        retries: 0
      };
      const insertResults = await addUserSession({
        ...session_data,
        datastore: JSON.stringify(dataStore)
        //datastore: dataStore
      });
      currentmenu = starting_menu.id;
      datastore = dataStore;
      retries = 0;
      response = {
        response_type: 2,
        text: starting_menu.title,
        options: returnOptions(starting_menu)
      };
      return response;
    } else {
      currentmenu = session_details.currentmenu;
      datastore = session_details.datastore;
      retries = session_details.retries;
    }
    try{
      datastore = JSON.parse(datastore);
    }catch(e){
      
    }
    const menus = datastore.menus;
    const _currentMenu = menus[currentmenu];
    // checking for previous menu is not auth and checking if user need previous menu
    const _previous_menu = menus[_currentMenu.previous_menu] || {}
    if (_previous_menu && _previous_menu.type !== 'auth' && USSDRequest === '#' && menu_types_with_back.includes(_currentMenu.type)) {
      response = await returnNextMenu(sessionid, _currentMenu.previous_menu, menus);
    } else {
      if (_currentMenu.type === 'auth') {
        if (_currentMenu.number_of_retries && retries >= _currentMenu.number_of_retries) {
          response = {
            response_type: 1,
            text: _currentMenu.fail_message
          };
        } else {
          response = await checkAuthKey(sessionid, USSDRequest, _currentMenu, menus, retries);
        }
      } else if (_currentMenu.type === 'data') {
        const {
          options
        } = _currentMenu;
        if (options && options.length) {
          const {
            passed,
            correctOption,
            next_menu_response
          } = await checkOptionSetsAnswer(sessionid, _currentMenu, USSDRequest, menus);
          if (passed) {
            response = await collectData(sessionid, _currentMenu, correctOption);
            if (next_menu_response) {
              response = next_menu_response;
            } else {
              response = await returnNextMenu(sessionid, _currentMenu.next_menu, menus);
            }
          } else {
            // Return menu for data collector with options
            const retry_message = menus.retry_message || 'You did not enter the correct choice, try again'
            response = await returnNextMenu(sessionid, _currentMenu.id, menus, retry_message);
          }
        } else {
          // checking for values types from current menu and value send from ussd
          if (_currentMenu.field_value_type && numericalValueTypes.includes(_currentMenu.field_value_type) && !isNumeric(USSDRequest)) {
            const retry_message = menus.retry_message || 'You did not enter numerical value, try again'
            response = await returnNextMenu(sessionid, _currentMenu.id, menus, retry_message);
          } else {
            response = await collectData(sessionid, _currentMenu, USSDRequest);
            response = await returnNextMenu(sessionid, _currentMenu.next_menu, menus);
          }
        }
      } else if (_currentMenu.type === 'options') {
        response = checkOptionsAnswer(sessionid, _currentMenu, USSDRequest, menus);
      } else if (_currentMenu.type === 'period') {
        response = await checkPeriodAnswer(sessionid, _currentMenu, USSDRequest, menus);
      } else if (_currentMenu.type === 'ou') {
        response = await checkOrgUnitAnswer(sessionid, _currentMenu, USSDRequest, menus);
      } else if (_currentMenu.type === 'message') {
        response = terminateWithMessage(sessionid, _currentMenu);
      }

      // if you are to submit data submit here.
      if (_currentMenu.submit_data) {
        if ((_currentMenu.type = 'data-submission')) {
          if (USSDRequest <= dataSubmissionOptions.length) {
            if (dataSubmissionOptions[USSDRequest - 1]) {

              const validation = await validatedData(sessionid, _currentMenu, menus);
              if (validation.notSet.length > 0) {
                const message = 'The following data is not entered:' + validation.notSet.join(',');
                response = {
                  response_type: 1,
                  text: message
                };
              } else {
                // handling error message
                const requestResponse = await submitData(sessionid, _currentMenu, msisdn, USSDRequest, menus);
                if (requestResponse && requestResponse.status && successStatus.includes(requestResponse.status)) {
                  await completeForm(sessionid, msisdn);
                  response = await returnNextMenu(sessionid, _currentMenu.next_menu, menus);
                } else {
                  //terminate with proper error messages
                  const error_message = await getSanitizedErrorMessage(requestResponse);
                  response = {
                    response_type: 1,
                    text: error_message
                  };
                }
              }
            } else {
              response = {
                response_type: 1,
                text: 'Terminating the session'
              };
            }
          } else {
            const retry_message = menus.retry_message || 'You did not enter the correct choice, try again'
            response = await returnNextMenu(sessionid, _currentMenu.id, menus, retry_message);
          }
        } else {
          const {
            httpStatus
          } = await submitData(sessionid, _currentMenu, msisdn, USSDRequest, menus);
          if (httpStatus !== OK) {
            response = {
              response_type: 1,
              text: 'Terminating the session'
            };
          }
        }
      }
    }
  }catch(e){
    console.log(e.stack);
    response = {
      response_type: 1,
      text: 'Server Error. Please try again.'
    };
  }
  return response;
};

const checkAuthKey = async (sessionid, response, currentMenu, menus, retries) => {
  let message;
  const {
    next_menu,
    retry_message
  } = currentMenu;
  if (response === currentMenu.auth_key) {
    message = await returnNextMenu(sessionid, next_menu, menus);
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
const returnNextMenu = async (sessionid, next_menu, menus, additional_message) => {
  let message;
  await updateUserSession(sessionid, {
    currentmenu: next_menu,
    retries: 0
  });
  const menu = menus[next_menu];
  const _previous_menu = menus[menu.previous_menu] || {}
  console.log('menu.type:', menu.type)
  if (menu.type === 'options') {
    message = {
      response_type: 2,
      text: menu.title,
      options: returnOptions(menu)
    };
  } else if (menu.type === 'period' || menu.type === 'data') {
    const {
      use_for_year,
      years_back
    } = menu;
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
          options: returnOptions(menu)
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
    const connfirmationSummary = await getConfirmationSummarySummary(sessionid, menus);
    const submitOptions = ['YES', 'NO'];
    const submitMsgString = [menu.title, ...submitOptions.map((option, index) => `${index + 1}. ${option}`)].join('\n');
    message = {
      response_type: 2,
      text: menu.title,
      options: returnOptions(menu)
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
  }
  // checking if previous menu is not of type auth and add back menu  
  if (_previous_menu && _previous_menu.type !== 'auth' && menu_types_with_back.includes(menu.type)) {
    message.text += `\n# Rudi`
  }
  if (additional_message) {
    message.text += `\n${additional_message}`;
  }
  return message;
};

// Option Answers.
const checkOptionsAnswer = async (sessionid, menu, answer, menus) => {
  const {
    options
  } = menu;
  const responses = options.map(option => option.response);
  if (!responses.includes(answer)) {
    // return menu with options in case of incorrect value on selection
    if (menu.type === 'options' && menu.options) {
      return {
        response_type: 2,
        text: menu.title + '\n' + (menu.retry_message || 'You did not enter the correct choice,try again'),
        options: returnOptions(menu)
      };
    } else {
      return {
        response_type: 1,
        text: `${menu.fail_message || 'You did not enter the correct choice'}`
      };
    }
  }

  const correctOption = options.filter(option => option.response === answer)[0];
  const {
    next_menu
  } = correctOption;
  return await returnNextMenu(sessionid, next_menu, menus);
};

// Option Answers.
const checkOptionSetsAnswer = async (sessionid, menu, answer, menus) => {
  const {
    options
  } = menu;
  const responses = options.map(option => option.response);
  let passed = true;
  let correctOption = null;
  let next_menu_response = null;
  if (!responses.includes(answer)) {
    passed = !passed;
  } else {
    const {
      value,
      next_menu
    } = options.filter(option => option.response === answer)[0];
    if (next_menu) {
      next_menu_response = await returnNextMenu(sessionid, next_menu, menus);
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
const returnOptions = ({
  options
}) => {
  let returnOptions = {};
  options.forEach((option) => {
    if (typeof option.response === 'boolean'){
      returnOptions[option.response?'1':'2'] = option.title;
    }else {
      returnOptions[option.response] = option.title;
    }
  })
  return returnOptions;
};
// check Period answer
const checkPeriodAnswer = async (sessionid, menu, answer, menus) => {
  let response;
  const {
    period_type,
    maximum_value,
    next_menu,
    use_for_year,
    years_back
  } = menu;
  response = await returnNextMenu(sessionid, next_menu, menus);
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
        response = await returnNextMenu(sessionid, menu.id, menus, retry_message)
      }
    } else {
      //checking for validity of values for other priod types
      if (answer > 0 && maximum_value && answer <= maximum_value) {
        const period_value = getPeriodBytype(period_type, answer);
        const period = period_type === 'BiMonthly' ? `${period_value}${periodTypes[period_type]}` : `${periodTypes[period_type]}${period_value}`
        await collectPeriodData(sessionid, {
          period
        });
      } else {
        const retry_message = `${answer} is out range of 1 to ${maximum_value}, try again`;
        response = await returnNextMenu(sessionid, menu.id, menus, retry_message)
      }
    }
  } else {
    const retry_message = menu.retry_message || `You did not enter numerical value, try again`;
    response = await returnNextMenu(sessionid, menu.id, menus, retry_message)
  }
  return response;
};

const checkOrgUnitAnswer = async (sessionid, menu, answer, menus) => {
  let response;
  const {
    period_type,
    maximum_value,
    next_menu,
    use_for_year,
    years_back
  } = menu;
  //checking for period value and return appropriate menu in case of wrong selection
  if (isNumeric(answer)) {
    const ruleHasNotPassed = await ruleNotPassed(sessionid, menu, answer);

    if (ruleHasNotPassed) {
      if (ruleHasNotPassed.type === 'ERROR') {
        response = await returnNextMenu(sessionid, menu.id, menus, ruleHasNotPassed.errorMessage);
      }
    } else {
      const results = await getOrganisationUnitByCode(answer);
      if (results.organisationUnits.length > 0) {
        const orgUnit = results.organisationUnits[0].id;
        await collectOrganisationUnitData(sessionid, {
          orgUnit
        })
        response = await returnNextMenu(sessionid, next_menu, menus);
      } else {
        const retry_message = menu.retry_message || `You did not enter a valid code, try again`;
        response = await returnNextMenu(sessionid, menu.id, menus, retry_message);
      }
    }
  } else {
    response = await returnNextMenu(sessionid, menu.id, menus)
  }
  return response;
};

const getPeriodBytype = (period_type, value) => {
  return period_type === 'Monthly' ? value > 9 ? `${value}` : `0${value}` : value;
}

const terminateWithMessage = async (sessionid, menu) => {
  // TODO: DO other things like deleting session. not to overcloud database.
  return {
    response_type: 1,
    text: menu.title
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