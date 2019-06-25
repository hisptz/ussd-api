import {
  getCurrentSession,
  updateUserSession
} from '../../db';
import {
  collectData,
  submitData,
  collectPeriodData,
  validatedData
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
  let response;
  console.log('sessionid:', sessionid);
  try{
    const {
      currentmenu,
      datastore,
      retries
    } = await getCurrentSession(sessionid);
    if (!datastore){
      console.log(sessionid, currentmenu, datastore, retries)
    }
    const menus = JSON.parse(datastore).menus;
    const _currentMenu = menus[currentmenu];
    // checking for previous menu is not auth and checking if user need previous menu
    const _previous_menu = menus[_currentMenu.previous_menu] || {}
    if (_previous_menu && _previous_menu.type !== 'auth' && USSDRequest === '99' && menu_types_with_back.includes(_currentMenu.type)) {
      response = await returnNextMenu(sessionid, _currentMenu.previous_menu, menus);
    } else {
      if (_currentMenu.type === 'auth') {
        if (_currentMenu.number_of_retries && retries >= _currentMenu.number_of_retries) {
          response = `C;${sessionid};${_currentMenu.fail_message}`;
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
                response = `C;${sessionid};${message}`;
              } else {
                // handling error message
                const requestResponse = await submitData(sessionid, _currentMenu, msisdn, USSDRequest, menus);
                if (requestResponse && requestResponse.status && successStatus.includes(requestResponse.status)) {
                  response = await returnNextMenu(sessionid, _currentMenu.next_menu, menus);
                } else {
                  //terminate with proper error messages
                  const error_message = await getSanitizedErrorMessage(requestResponse);
                  response = `C;${sessionid};${error_message}`;
                }
              }
            } else {
              response = `C;${sessionid};Terminating the session`;
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
            response = `C;${sessionid};Terminating the session`;
          }
        }
      }
    }
  }catch(e){
    console.log(e.stack);
    response = `C;${sessionid};Server Error. Please try again.`;
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
    message = `P;${sessionid};${retry_message}`;
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
  if (menu.type === 'options') {
    message = `P;${sessionid};${returnOptions(menu)}`;
  } else if (menu.type === 'period' || menu.type === 'data') {
    const {
      use_for_year,
      years_back
    } = menu;
    if (use_for_year) {
      const arrayOfYears = getYears(years_back);
      const msg_str = [menu.title, ...arrayOfYears.map((year, index) => `${index + 1}. ${year}`)].join('\n');
      message = `P;${sessionid};${msg_str}`;
    } else {
      if (menu.options && menu.options.length) {
        message = `P;${sessionid};${returnOptions(menu)}`;
      } else {
        message = `P;${sessionid};${menu.title}`;
      }
    }
  } else if (menu.type === 'message') {
    message = await terminateWithMessage(sessionid, menu);
  } else if (menu.type === 'data-submission') {
    const connfirmationSummary = await getConfirmationSummarySummary(sessionid, menus);
    const submitOptions = ['YES', 'NO'];
    const submitMsgString = [menu.title, ...submitOptions.map((option, index) => `${index + 1}. ${option}`)].join('\n');
    message = `P;${sessionid};${submitMsgString}`;
    if (connfirmationSummary !== "") {
      message += `\n${connfirmationSummary}`;
    }
  }
  // checking if previous menu is not of type auth and add back menu  
  if (_previous_menu && _previous_menu.type !== 'auth' && menu_types_with_back.includes(menu.type)) {
    message += `\n99 Back`
  }
  if (additional_message) {
    message += `\n${additional_message}`;
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
      return `P;${sessionid};${returnOptions(menu)}\n${menu.retry_message || 'You did not enter the correct choice,try again'}`;
    } else {
      return `C;${sessionid};${menu.fail_message || 'You did not enter the correct choice'}`;
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

const returnOptions = ({
  title,
  options
}) => {
  return [title, ...options.map(({
    response,
    title
  }) => `${response}. ${title}`)].join('\n');
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

const getPeriodBytype = (period_type, value) => {
  return period_type === 'Monthly' ? value > 9 ? `${value}` : `0${value}` : value;
}

const terminateWithMessage = async (sessionid, menu) => {
  // TODO: DO other things like deleting session. not to overcloud database.
  return `C;${sessionid};${menu.title}`;
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