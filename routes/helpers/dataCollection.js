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
import { getTrackedEntityInstance, getContactTrackedEntityInstance, getSuspectTrackedEntityInstance } from '../../endpoints/trackerData';
import { getAggregateData } from '../../endpoints/dataValueSets';
import { getEventData } from '../../endpoints/eventData';
import { getDataSet, complete } from '../../endpoints/dataSet';
import { sendSMS } from '../../endpoints/sms';
import { getOrganisationUnit } from '../../endpoints/organisationUnit';
import { getEventDate, getCurrentWeekNumber, getRandomCharacters } from './periods';
import { generateCovidCode } from '../../endpoints/covidCode';
import * as _ from 'lodash';

const { generateCode } = require('dhis2-uid');

export const collectData = async (sessionid, _currentMenu, USSDRequest) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);

  const { data_type, category_combo, data_element, program, program_stage, tracked_entity_type, tracked_entity_attribute } = _currentMenu;

  const dataValue = [
    {
      dataElement: data_element,
      categoryOptionCombo: category_combo,
      trackedEntityAttribute: tracked_entity_attribute,
      programStage: program_stage,
      value: USSDRequest
    }
  ];

  //console.log(dataValue[0]);
  const generatedId = _currentMenu.menu_id == 'XTaJG3uniujLyP3rQnqeoGHpwizuzj4' ? await generateCovidCode() : '';

  if (_currentMenu.menu_id == 'XTaJG3uniujLyP3rQnqeoGHpwizuzj4') {
    console.log('generated Id object :: ', generatedId);

    dataValue.push({
      dataElement: '',
      categoryOptionCombo: '',
      trackedEntityAttribute: 'DBBpxkM88w5',
      programStage: '',
      value: generatedId && generatedId['value'] ? generatedId['value'] : ''
    });
  }
  let data = {
    sessionid,
    programStage: program_stage,
    program,
    trackedEntityType: tracked_entity_type,
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

    if (!sessionDatavalues.programStage || sessionDatavalues.programStage == '') {
      await updateSessionDataValues(sessionDatavalues.sessionid, { programStage: program_stage });
    }

    data.programStage = program_stage == '' ? sessionDatavalues['programStage'] : program_stage;

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
  const sessionDatavalues = await getSessionDataValue(sessionid);

  const { datatype, program, programStage, trackedEntityType } = sessionDatavalues;

  //console.log('data_type ::: ', datatype);
  if (datatype === 'aggregate') {
    await updateUserSession(sessionid, { done: true });
    return sendAggregateData(sessionid, msisdn);
  } else if (datatype === 'event') {
    await updateUserSession(sessionid, { done: true });
    return sendEventData(sessionid, program, programStage, msisdn, _currentMenu);
  } else if (datatype === 'tracker') {
    return sendTrackerData(sessionid, program, trackedEntityType, msisdn, _currentMenu);
  } else {
    await updateUserSession(sessionid, { done: true });
    return completeForm(sessionid);
  }
};
export const ruleNotPassed = async (sessionid, menu, answer) => {
  console.log(menu.p_rules);
  if (menu.p_rules) {
    const sessionDatavalues = await getSessionDataValue(sessionid);

    let retValue = false;
    JSON.parse(menu.p_rules).forEach(rule => {
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
    } else if (dataValues.datatype === 'tracker') {
      referenceNumber = _.find(dataValues.dataValues, dataValue => {
        return dataValue.trackedEntityAttribute == 'DBBpxkM88w5';
      }).value;

      console.log('ref no 1:: ', referenceNumber);
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
      status: '',
      dataValues: dtArray
    };

    const response = await updateSessionDataValues(sessionid, {
      sessionid: sessionid,
      datatype: 'event',
      program,
      programStage,
      dataValues: JSON.stringify(eventDataToPost)
    });

    return response;
  }
};

const sendTrackerData = async (sessionid, program, trackedEntityType, msisdn, currentMenu) => {
  //console.log('i get into send tracker data');
  const sessionDatavalues = await getSessionDataValue(sessionid);
  //console.log('s d values :::', sessionDatavalues);
  const sessions = await getCurrentSession(sessionid);

  //console.log('curr session ::', sessions);
  const { dataValues } = sessionDatavalues;
  const { orgUnit } = sessions;

  let application_info = await getApplicationById(sessions.application_id);
  //console.log('app info :::', application_info);

  const { phone_number_mapping, auto_generated_field } = application_info;
  let dtValues = dataValues;
  try {
    dtValues = JSON.parse(dataValues);
  } catch (e) {}

  let dtArray = dtValues.map(({ trackedEntityAttribute, value, programStage }) => ({
    attribute: trackedEntityAttribute,
    stage: programStage,
    value
  }));
  // adding phone number if exist on mapping
  /*if (phone_number_mapping && phone_number_mapping[program]) {
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
  }*/

  const sync_servers = await getSyncServerByAppId(currentMenu.application_id);
  //console.log('sync servers ::', sync_servers);

  let sync_server;
  for (sync_server of sync_servers) {
    await addSync({ syncserver_id: sync_server.id, session_id: sessionid, synced: false, retries: 0 });
  }

  //console.log('after adding syncs');

  await addMessage(sessionid, msisdn);

  //console.log('after adding message');

  if (currentMenu.mode && currentMenu.mode == 'tracker_event_add') {
    try {
      let code = _.find(dtArray, dt => {
        return dt.attribute == 'DBBpxkM88w5';
      }).value;

      let existingTEInstance = await getTrackedEntityInstance(code);
      if (existingTEInstance['trackedEntityInstances'].length == 0) {
        existingTEInstance = await getContactTrackedEntityInstance(code);
        if (existingTEInstance['trackedEntityInstances'].length == 0) {
          existingTEInstance = await getSuspectTrackedEntityInstance(code);
        }
      }

      //trackedEntityInstance: trackedEntityInstance,
      // let trackerUpdatedData = {
      //   trackedEntityInstance: existingTEInstance['trackedEntityInstances'][0][trackedEntityInstance],
      //   trackedEntityType,
      //   orgUnit: orgUnit,
      //   attributes: _.filter(dtArray, attribute => {
      //     return attribute.stage == '' ? true : false;
      //   }).map(({ attribute, value }) => ({ attribute, value })),
      //   enrollments: [
      //     {
      //       trackedEntityInstance: trackedEntityInstance,
      //       program,
      //       orgUnit: orgUnit,
      //       enrollmentDate: getEventDate(),
      //       incidentDate: getEventDate(),
      //       events: [
      //         {
      //           program,
      //           orgUnit: orgUnit,
      //           eventDate: getEventDate(),
      //           status: 'COMPLETED',
      //           programStage: sessionDatavalues.programStage,
      //           dataValues: _.filter(dtArray, attribute => {
      //             return attribute.stage != '' ? true : false;
      //           }).map(({ attribute, value }) => ({ dataElement: attribute, value }))
      //         }
      //       ]
      //     }
      //   ]
      // };

      let eventData = {
        trackedEntityInstance: existingTEInstance['trackedEntityInstances'][0]['trackedEntityInstance'],
        program,
        orgUnit: existingTEInstance['trackedEntityInstances'][0]['orgUnit'],
        eventDate: getEventDate(),
        status: 'COMPLETED',
        programStage: sessionDatavalues.programStage,
        dataValues: _.filter(dtArray, attribute => {
          return attribute.stage != '' ? true : false;
        }).map(({ attribute, value }) => ({ dataElement: attribute, value }))
      };

      console.log('event data :: ', eventData);
      //console.log('dataValues:', eventData.dataValues[0], eventData.dataValues[1], eventData.dataValues[2], eventData.dataValues[3]);

      const response = await updateSessionDataValues(sessionid, {
        sessionid: sessionid,
        datatype: 'tracker',
        trackedEntityType: trackedEntityType,
        tracker_event_add: true,
        dataValues: JSON.stringify(eventData)
      });

      await updateUserSession(sessionid, { done: true });

      // //console.log('responce from send tracker :: ', response);

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    try {
      const trackedEntityInstance = await generateCode();
      //console.log('id ::: >', trackedEntityInstance);
      console.log('trackedEntityInstanceId :: ', trackedEntityInstance);

      //trackedEntityInstance: trackedEntityInstance,
      let trackerUpdateData = {
        trackedEntityInstance: trackedEntityInstance,
        trackedEntityType,
        orgUnit: orgUnit,
        attributes: _.filter(dtArray, attribute => {
          return attribute.stage == '' ? true : false;
        }).map(({ attribute, value }) => ({ attribute, value })),
        enrollments: [
          {
            trackedEntityInstance: trackedEntityInstance,
            program,
            orgUnit: orgUnit,
            enrollmentDate: getEventDate(),
            incidentDate: getEventDate(),
            events: [
              {
                program,
                orgUnit: orgUnit,
                eventDate: getEventDate(),
                status: 'COMPLETED',
                programStage: sessionDatavalues.programStage,
                dataValues: _.filter(dtArray, attribute => {
                  return attribute.stage != '' ? true : false;
                }).map(({ attribute, value }) => ({ dataElement: attribute, value }))
              }
            ]
          }
        ]
      };

      // console.log(' i get here ::', trackerUpdateData);
      // console.log(' i get here ::', trackerUpdateData['enrollments'][0]['events']);
      // console.log(' i get here ::', trackerUpdateData['enrollments'][0]['events'][0]['dataValues']);
      const response = await updateSessionDataValues(sessionid, {
        sessionid: sessionid,
        datatype: 'tracker',
        trackedEntityType: trackedEntityType,
        dataValues: JSON.stringify(trackerUpdateData)
      });

      await updateUserSession(sessionid, { done: true });

      //console.log('responce from send tracker :: ', response);

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
