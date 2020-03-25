import { getSessionDataValue, updateSessionDataValues, addSessionDatavalues, updateUserSession, getCurrentSession } from '../../db';
import { postAggregateData, getAggregateData } from '../../endpoints/dataValueSets';
import { postEventData, updateEventData, getEventData } from '../../endpoints/eventData';
import { getDataSet, complete } from '../../endpoints/dataSet';
import { sendSMS } from '../../endpoints/sms';
import { getOrganisationUnit } from '../../endpoints/organisationUnit';
import { getEventDate, getCurrentWeekNumber, getRandomCharacters } from './periods';
import * as _ from 'lodash';

export const collectData = async (sessionid, _currentMenu, USSDRequest) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const { dataType, category_combo, data_element, program, program_stage } = _currentMenu;
  const dataValue = [
    {
      dataElement: data_element,
      categoryOptionCombo: category_combo,
      value: USSDRequest
    }
  ];
  const data = {
    sessionid,
    programStage: program_stage,
    program,
    datatype: dataType
  };
  if (sessionDatavalues) {
    let oldDataValues = sessionDatavalues.dataValues;
    try {
      oldDataValues = JSON.parse(oldDataValues);
    } catch (e) {}
    const dataValues = [...oldDataValues, ...dataValue];
    return updateSessionDataValues(sessionid, {
      ...data,
      dataValues: JSON.stringify(dataValues)
      //dataValues: dataValues
    });
  }

  return addSessionDatavalues({
    ...data,
    dataValues: JSON.stringify(dataValue)
    //dataValues: dataValue
  });
};

export const submitData = async (sessionid, _currentMenu, msisdn, USSDRequest, menus) => {
  console.log('-------------------------*******----------------------------');

  const sessionDatavalues = await getSessionDataValue(sessionid);

  //console.log('sessionDataValues', sessionDatavalues);
  const { datatype, program, programStage } = sessionDatavalues;
  if (datatype === 'aggregate') {
    return sendAggregateData(sessionid);
  } else if (datatype === 'event') {
    return sendEventData(sessionid, program, programStage, msisdn, _currentMenu);
  } else {
    return completeForm(sessionid, msisdn);
  }
};
export const ruleNotPassed = async (sessionid, menu, answer) => {
  if (menu.rules) {
    const sessionDatavalues = await getSessionDataValue(sessionid);

    let retValue = false;
    menu.rules.forEach(rule => {
      let ruleEval = rule.condition;
      if (sessionDatavalues && sessionDatavalues.dataValues) {
        let dtValues = sessionDatavalues.dataValues;
        try {
          dtValues = JSON.parse(sessionDatavalues.dataValues);
        } catch (e) {}
        dtValues.forEach(dtValue => {
          ruleEval = ruleEval.split('#{' + dtValue.dataElement + '}').join(dtValue.value);
        });
      }
      ruleEval = ruleEval.split('#{' + menu.data_element + '}').join(answer);
      ruleEval = ruleEval.split('#{answer}').join(answer);
      try {
        if (eval('(' + ruleEval + ')')) {
          retValue = rule.action;
        }
      } catch (e) {}
    });
    return retValue;
  } else {
    return false;
  }
};
export const validatedData = async (sessionid, _currentMenu, USSDRequest, menus) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);

  const session = await getCurrentSession(sessionid);
  let menu = session.datastore;
  try {
    menu = JSON.parse(session.datastore);
  } catch (e) {}
  menu = menu.menus[session.currentmenu];
  const returnValue = {
    notSet: []
  };
  if (menu.dataSet) {
    const dataSet = await getDataSet(menu.dataSet);
    const dataValueSet = await getAggregateData(menu.dataSet, sessionDatavalues.year + sessionDatavalues.period, session.orgUnit);
    const ids = [];
    dataSet.dataSetElements.forEach(dataSetElement => {
      dataSetElement.categoryCombo.categoryOptionCombos.forEach(categoryOptionCombo => {
        let found = false;
        if (dataValueSet.dataValues) {
          dataValueSet.dataValues.forEach(dataValue => {
            if (dataValue.dataElement === dataSetElement.dataElement.id && dataValue.categoryOptionCombo === categoryOptionCombo.id) {
              found = true;
            }
          });
        }
        if (!found && menu.compulsory && menu.compulsory.indexOf(dataSetElement.dataElement.id + '.' + categoryOptionCombo.id) > -1) {
          returnValue.notSet.push(dataSetElement.dataElement.shortName + ' ' + categoryOptionCombo.shortName);
          ids.push(dataSetElement.dataElement.id + '.' + categoryOptionCombo.id);
        }
      });
    });
  }
  return returnValue;
};

export const collectPeriodData = async (sessionid, obj) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  if (sessionDatavalues) {
    sessionDatavalues.dataValues = JSON.stringify(sessionDatavalues.dataValues);
    return updateSessionDataValues(sessionid, {
      ...sessionDatavalues,
      ...obj
    });
  }
  return addSessionDatavalues({
    sessionid,
    ...obj
  });
};

export const collectOrganisationUnitData = async (sessionid, obj) => {
  const sessionData = await getCurrentSession(sessionid);
  return updateUserSession(sessionid, {
    ...sessionData,
    ...obj
  });
};

export const getCurrentSessionDataValue = async sessionid => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  let { dataValues, datatype } = sessionDatavalues;
  try {
    dataValues = JSON.parse(dataValues);
  } catch (e) {}
  return {
    dataValues: dataValues,
    datatype
  };
};

const sendAggregateData = async sessionid => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const { dataValues, year, period } = sessionDatavalues;
  const { orgUnit } = sessions;
  const finalPeriod = `${year}${period}`;
  let dtValues = dataValues;
  try {
    dtValues = JSON.parse(dataValues);
  } catch (e) {}
  const dtArray = dtValues
    .map(({ categoryOptionCombo, dataElement, value }) => ({
      categoryOptionCombo,
      dataElement,
      value,
      period: finalPeriod,
      orgUnit
    }))
    .filter(dt => {
      return dt.dataElement ? true : false;
    });

  //console.log('data to post ::', dtArray);

  const response = await postAggregateData({
    dataValues: dtArray
  });
  return response;
};
export const completeForm = async (sessionid, phoneNumber) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const session = await getCurrentSession(sessionid);
  const { dataValues, year, period } = sessionDatavalues;
  const { orgUnit } = session;
  let menu = session.datastore;
  try {
    menu = JSON.parse(session.datastore);
  } catch (e) {}
  menu = menu.menus[session.currentmenu];
  const response = await complete(menu.dataSet, year + '' + period, orgUnit);
  const phoneNumbers = [phoneNumber];
  //phoneNumbers.push();
  const orgUnitDetails = await getOrganisationUnit(orgUnit);
  if (menu.submission_message) {
    let dataValues = await getSessionDataValue(sessionid);

    //console.log('dataValues', dataValues);
    let referenceNumber = _.find(dataValues.dataValues, dataValue => {
      return dataValue.dataElement == 'KlmXMXitsla';
    });

    let message = menu.submission_message;
    message = message.split('${period_year}').join(year);
    message = message.split('${sub_period}').join(period);
    message = message.split('${org_unit_code}').join(orgUnitDetails.code);

    if (referenceNumber) {
      message = message.split('${ref_number}').join(referenceNumber.value);
    }

    const result = await sendSMS(phoneNumbers, message);
  }
  return response;
};

const sendEventData = async (sessionid, program, programStage, msisdn, currentMenu) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const { dataValues } = sessionDatavalues;
  const { orgUnit } = sessions;
  let datastore = sessions.datastore;
  try {
    datastore = JSON.parse(session.datastore);
  } catch (e) {}
  const { phone_number_mapping, auto_generated_field } = datastore.settings;
  let dtValues = dataValues;
  try {
    dtValues = JSON.parse(dataValues);
  } catch (e) {}
  let dtArray = dtValues.map(({ dataElement, value }) => ({
    dataElement,
    value
  }));
  // adding phone number if exist on mapping
  if (phone_number_mapping && phone_number_mapping[program]) {
    const mappings = phone_number_mapping[program];
    mappings.map(mapping => {
      const { program_stage, data_element } = mapping;
      if (program_stage && programStage === program_stage && data_element) {
        dtArray.push({
          dataElement: data_element,
          value: msisdn
        });
      }
    });
  }
  // adding  auto generated fields if exist on mapping
  if (auto_generated_field && auto_generated_field[program]) {
    const mappings = auto_generated_field[program];
    mappings.map(mapping => {
      const { program_stage, data_element } = mapping;
      const value = `${getCurrentWeekNumber()}-${getRandomCharacters(12)}`;
      if (program_stage && programStage === program_stage && data_element) {
        dtArray.push({
          dataElement: data_element,
          value
        });
      }
    });
  }

  if (currentMenu.mode) {
    if (currentMenu.mode == 'event_update') {
      let referralId = _.find(dtArray, dt => {
        return dt.dataElement == 'KlmXMXitsla';
      }).value;

      let hfrCode = _.find(dtArray, dt => {
        return dt.dataElement == 'MfykP4DsjUW';
      }).value;

      let hfrDataValue = {
        lastUpdated: getEventDate(),
        created: getEventDate(),
        dataElement: 'MfykP4DsjUW',
        value: hfrCode,
        providedElsewhere: false
      };

      let currentEventData = await getEventData('KlmXMXitsla', referralId, currentMenu.program);

      //console.log('current event data', currentEventData);

      let eventUpdatedData = {};
      eventUpdatedData['program'] = currentEventData.events[0].program;
      eventUpdatedData['programStage'] = currentEventData.events[0].programStage;
      eventUpdatedData['orgUnit'] = currentEventData.events[0].orgUnit;
      eventUpdatedData['status'] = currentEventData.events[0].status;
      eventUpdatedData['eventDate'] = currentEventData.events[0].eventDate;
      eventUpdatedData['event'] = currentEventData.events[0].event;
      eventUpdatedData['dataValues'] = currentEventData.events[0].dataValues;
      eventUpdatedData['completedDate'] = getEventDate();
      eventUpdatedData.dataValues.push(hfrDataValue);
      //console.log('eventsUpdatedData', eventUpdatedData.dataValues);
      //console.log('hfrCode', hfrCode);

      const response = await updateEventData(eventUpdatedData, eventUpdatedData.event);

      return response;
    }
  } else {
    const response = await postEventData({
      program,
      programStage,
      eventDate: getEventDate(),
      orgUnit,
      status: 'COMPLETED',
      dataValues: dtArray
    });

    return response;
  }
};
