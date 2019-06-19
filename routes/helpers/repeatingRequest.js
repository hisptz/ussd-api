import {
  getCurrentSession,
  updateUserSession
} from '../../db';
import {
  collectData,
  submitData,
  collectPeriodData
} from './dataCollection';
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
]

const dataSubmissionOptions = [true, false];
const OK = 'OK';

export const repeatingRequest = async (sessionid, USSDRequest) => {
  let response;
  const {
    currentmenu,
    datastore,
    retries
  } = await getCurrentSession(sessionid);
  const menus = JSON.parse(datastore).menus;
  const _currentMenu = menus[currentmenu];

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
        response = `C;${sessionid};${_currentMenu.fail_message || 'You did not enter the correct choice'}`;
      }
    } else {
      // checking for values types from current menu and value send from ussd
      if (_currentMenu.field_value_type && numericalValueTypes.includes(_currentMenu.field_value_type) && !isNumeric(USSDRequest)) {
        response = `P;${sessionid};${_currentMenu.retry_message || 'You did not enter numerical value, try again'}`;
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
      if (dataSubmissionOptions[USSDRequest - 1]) {
        const {
          httpStatus,
          httpStatusCode,
          message
        } = await submitData(sessionid, _currentMenu, menus);
        if (httpStatus !== OK) {
          response = `C;${sessionid};${message}`;
        }
        response = await returnNextMenu(sessionid, _currentMenu.next_menu, menus);
      } else {
        response = `C;${sessionid};Terminating the session`;
      }
    } else {
      const {
        httpStatus,
        httpStatusCode,
        message
      } = await submitData(sessionid, _currentMenu, menus);
      if (httpStatus !== OK) {
        response = `C;${sessionid};Terminating the session`;
      }
    }
  }
  return response;
};

const checkAuthKey = async (sessionid, response, currentMenu, menus, retries) => {
  let message;
  const {
    next_menu,
    number_of_retries,
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
const returnNextMenu = async (sessionid, next_menu, menus) => {
  let message;
  await updateUserSession(sessionid, {
    currentmenu: next_menu,
    retries: 0
  });
  const menu = menus[next_menu];
  if (menu.type === 'options') {
    message = `P;${sessionid};${returnOptions(menu)}`;
  } else if (menu.type === 'period' || menu.type === 'data') {
    const {
      use_for_year,
      years_back,
      number_of_retries
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
    const submitOptions = ['YES', 'NO'];
    const submitMsgString = [menu.title, ...submitOptions.map((year, index) => `${index + 1}. ${year}`)].join('\n');
    message = `P;${sessionid};${submitMsgString}`;
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
      return `P;${sessionid};${returnOptions(menu)}`;
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

  if (answer > maximum_value && !use_for_year) {
    return `C;${sessionid};${menu.fail_message || 'You did not enter the correct choice'}`;
  }

  if (use_for_year) {
    if (isNumeric(answer) && answer > 0 && answer <= years_back + 1) {
      const year = getYears(years_back)[answer - 1];
      await collectPeriodData(sessionid, {
        year
      });
    } else {
      // TODO: do the retry tings.
    }
  } else {
    await collectPeriodData(sessionid, {
      period: `${periodTypes[period_type]}${answer}`
    });
  }

  const getNextMenu = await returnNextMenu(sessionid, next_menu, menus);

  return getNextMenu;
};

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