import {
  getSessionDataValue,
  updateSessionDataValues,
  addSessionDatavalues,
  updateUserSession,
  getCurrentSession,
  getMenuJson,
  getApplicationById,
  addSync,
  getSyncServerByAppId,
  addSms
} from '../../db';
import { postAggregateData, getAggregateData } from '../../endpoints/dataValueSets';
import { postEventData, updateEventData, getEventData } from '../../endpoints/eventData';
import { getDataSet, complete } from '../../endpoints/dataSet';
import { sendSMS } from '../../endpoints/sms';
import { getOrganisationUnit } from '../../endpoints/organisationUnit';
import { getEventDate, getCurrentWeekNumber, getRandomCharacters } from './periods';
import * as _ from 'lodash';

export const collectData = async (sessionid, _currentMenu, USSDRequest) => {
  console.log('current menu on data collect ::: ', _currentMenu);
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const { data_type, category_combo, data_element, program, program_stage } = _currentMenu;
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
    datatype: data_type
  };
  if (sessionDatavalues) {
    let oldDataValues = sessionDatavalues.dataValues;
    try {
      oldDataValues = JSON.parse(oldDataValues);
    } catch (e) {}
    const dataValues = [...oldDataValues, ...dataValue];

    if (!sessionDatavalues.data_set || sessionDatavalues.data_set == '') {
      await updateSessionDataValues(sessionDatavalues.sessionid, { data_set: _currentMenu.data_set });
    }

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

export const submitData = async (sessionid, _currentMenu, msisdn, USSDRequest) => {
  console.log('current menu :: ', _currentMenu);
  const sessionDatavalues = await getSessionDataValue(sessionid);

  const { datatype, program, programStage } = sessionDatavalues;

  if (datatype === 'aggregate') {
    return sendAggregateData(sessionid, msisdn);
  } else if (datatype === 'event') {
    return sendEventData(sessionid, program, programStage, msisdn, _currentMenu);
  } else {
    return completeForm(sessionid);
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
export const validatedData = async (sessionid, _currentMenu, USSDRequest) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);

  const session = await getCurrentSession(sessionid);
  let menu = await getMenuJson(session.currentmenu, session.application_id);
  const returnValue = {
    notSet: []
  };
  if (menu.data_set) {
    const dataSet = await getDataSet(menu.data_set);
    const dataValueSet = await getAggregateData(menu.data_set, sessionDatavalues.year + sessionDatavalues.period, session.orgUnit);
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

const sendAggregateData = async (sessionid, msisdn) => {
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

  const sync_servers = await getSyncServerByAppId(sessions.application_id);

  let sync_server;
  for (sync_server of sync_servers) {
    await addSync({ syncserver_id: sync_server.id, session_id: sessionid, synced: false, retries: 0 });
  }

  await addMessage(sessionid, msisdn);

  const response = await updateSessionDataValues(sessionid, {
    year: year,
    period: period,
    sessionid: sessionid,
    datatype: 'aggregate',
    dataValues: JSON.stringify(dtArray)
  });

  // const response = await postAggregateData({
  //   dataValues: dtArray
  // });

  return response;
};
export const completeForm = async (sessionid, phoneNumber) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const session = await getCurrentSession(sessionid);
  const { dataValues, year, period } = sessionDatavalues;
  const { orgUnit } = session;
  //let menu = session.datastore;
  // try {
  //   menu = JSON.parse(session.datastore);
  // } catch (e) {}
  // menu = menu.menus[session.currentmenu];

  let menu = await getMenuJson(session.currentmenu, session.application_id);

  const response = await complete(menu.data_set, year + '' + period, orgUnit);
  //const phoneNumbers = [phoneNumber];
  //phoneNumbers.push();
  //const orgUnitDetails = await getOrganisationUnit(orgUnit);
  //if (menu.submission_message) {
  //  let dataValues = await getSessionDataValue(sessionid);

  //  let referenceNumber;

  //  if (dataValues.datatype === 'event') {
  //    referenceNumber = _.find(dataValues.dataValues, dataValue => {
  //      return dataValue.dataElement == 'KlmXMXitsla';
  //    }).value;
  //  }

  //  let message = menu.submission_message;
  //  message = message.split('${period_year}').join(year);
  //  message = message.split('${sub_period}').join(period);
  //  message = message.split('${org_unit_code}').join(orgUnitDetails.code);
  //  message = message.split('${ref_number}').join(referenceNumber);
  //  const result = await sendSMS(phoneNumbers, message);
  //}
  return response;
};

export const addMessage = async (sessionid, phoneNumber) => {
  //console.log('got to the add message :::', sessionid, phoneNumber);
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const session = await getCurrentSession(sessionid);
  const { year, period } = sessionDatavalues;
  const { orgUnit } = session;

  let menu = await getMenuJson(session.currentmenu, session.application_id);

  let phoneNumbers = [];
  phoneNumbers.push(phoneNumber);

  const orgUnitDetails = await getOrganisationUnit(orgUnit);
  if (menu.submission_message) {
    let dataValues = await getSessionDataValue(sessionid);

    let referenceNumber;

    if (dataValues.datatype === 'event') {
      referenceNumber = _.find(dataValues.dataValues, dataValue => {
        return dataValue.dataElement == 'KlmXMXitsla';
      }).value;
    }

    let message = menu.submission_message;
    message = message.split('${period_year}').join(year);
    message = message.split('${sub_period}').join(period);
    message = message.split('${org_unit_code}').join(orgUnitDetails.code);
    message = message.split('${ref_number}').join(referenceNumber);

    //.log('message ::: ', message, 'phone number ::: ', phoneNumbers);

    let data = {
      status: 'QUEUED',
      text: message,
      phone_numbers: JSON.stringify(phoneNumbers),
      session_id: sessionid
    };
    await addSms(data);

    //const result = await sendSMS(phoneNumbers, message);
  }
};

const sendEventData = async (sessionid, program, programStage, msisdn, currentMenu) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const { dataValues } = sessionDatavalues;
  const { orgUnit } = sessions;

  let application_info = await getApplicationById(sessions.application_id);

  const { phone_number_mapping, auto_generated_field } = application_info;
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

  //specific for referrals confirmation menu, need to update a specific event
  //TODO: remove the ids to make it more generic
  if (currentMenu.mode && currentMenu.mode == 'event_update') {
    //add a sync entry
    // TODO :: Save sync info, send later
    //await addSync({ syncserver_id: '', session_id: '', synced: false, retries: 0 })

    //process and send request
    let referralId = parseInt(
      _.find(dtArray, dt => {
        return dt.dataElement == 'KlmXMXitsla';
      }).value
    );

    let hfrCode = _.find(dtArray, dt => {
      return dt.dataElement == 'pcEvQLQzTsN';
    }).value;

    let hfrDataValue = {
      lastUpdated: getEventDate(),
      created: getEventDate(),
      dataElement: 'pcEvQLQzTsN',
      value: hfrCode,
      providedElsewhere: false
    };

    let currentEventData = await getEventData('KlmXMXitsla', referralId, currentMenu.program);

    //console.log('event data :::', currentEventData);

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

    const response = await updateSessionDataValues(sessionid, {
      sessionid: sessionid,
      program: eventUpdatedData.program,
      datatype: 'event',
      programStage: eventUpdatedData.programStage,
      dataValues: eventUpdatedData,
      event: currentEventData.events[0].event
    });

    const sync_servers = await getSyncServerByAppId(currentMenu.application_id);

    let sync_server;
    for (sync_server of sync_servers) {
      await addSync({ syncserver_id: sync_server.id, session_id: sessionid, synced: false, retries: 0 });
    }

    await addMessage(sessionid, msisdn);

    //const response = await updateEventData(eventUpdatedData, eventUpdatedData.event);
    return response;
  } else {
    //add a sync entry
    // TODO :: Change logic to save sync info & send later
    const sync_servers = await getSyncServerByAppId(currentMenu.application_id);

    let sync_server;
    for (sync_server of sync_servers) {
      await addSync({ syncserver_id: sync_server.id, session_id: sessionid, synced: false, retries: 0 });
    }

    await addMessage(sessionid, msisdn);

    const eventDataToPost = {
      program,
      programStage,
      eventDate: getEventDate(),
      orgUnit,
      status: 'COMPLETED',
      dataValues: dtArray
    };

    const response = await updateSessionDataValues(sessionid, {
      sessionid: sessionid,
      datatype: 'event',
      program,
      programStage,
      dataValues: JSON.stringify(eventDataToPost)
    });

    //process and send request
    // const response = await postEventData({
    //   program,
    //   programStage,
    //   eventDate: getEventDate(),
    //   orgUnit,
    //   status: 'COMPLETED',
    //   dataValues: dtArray
    // });

    //console.log('response from post Event Data :: ', response);
    return response;
  }
};
