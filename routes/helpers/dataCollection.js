import { getSessionDataValue, updateSessionDataValues, addSessionDatavalues, updateUserSession, getCurrentSession } from '../../db';
import { postAggregateData, getAggregateData } from '../../endpoints/dataValueSets';
import { postEventData, updateEventData, getEventData, getEventByUid } from '../../endpoints/eventData';
import { getDataSet, complete } from '../../endpoints/dataSet';
import { sendSMS } from '../../endpoints/sms';
import { getOrganisationUnit, getOrganisationUnitByCode } from '../../endpoints/organisationUnit';
import { getEventDate, getCurrentWeekNumber, getRandomCharacters } from './periods';
import * as _ from 'lodash';
import { getEventUidByCode } from '../../endpoints/sqlViews';

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
  if (menu.pRules) {
    const sessionDatavalues = await getSessionDataValue(sessionid);

    let retValue = false;
    menu.pRules.forEach(rule => {
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

      //console.log('rule string :: ', ruleEval);
      try {
        if (eval('(' + ruleEval + ')')) {
          retValue = rule.action;
        }
      } catch (e) {}
    });

    //console.log('ret value ::', retValue);
    return retValue;
  } else {
    //console.log('here');
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
      //console.log('1 ::: > ', dtArray);
      let referralId = _.find(dtArray, dt => {
        return dt.dataElement == 'KlmXMXitsla';
      }).value;

      //console.log('referal', referralId);

      let hfrCode = _.find(dtArray, dt => {
        return dt.dataElement == 'MfykP4DsjUW';
      }).value;

      // console.log('dtArrayy :: ', dtArray);
      // let facilityType = _.find(dtArray, dt => {
      //   return dt.dataElement == 'SMzP1R6D1dV';
      // }).value;

      let facility = await getOrganisationUnitByCode(hfrCode);
      //console.log(hfrCode, 'facility :: ', facility);
      let facilityTypeName = () => {
        if (facility.organisationUnits && facility.organisationUnits.length > 0) {
          let facilityType = _.filter(facility.organisationUnits[0]['organisationUnitGroups'], ouGroup => {
            let groupSets = _.filter(ouGroup['groupSets'], groupSet => {
              return groupSet.id == 'VG4aAdXA4JI' ? true : false;
            });

            return groupSets.length > 0 ? true : false;
          });

          let facilityTypeName = facilityType.length > 0 ? facilityType[0].name : null;

          return facilityTypeName;
        }
      };

      //console.log('hfr ::: > ', hfrCode);
      let hfrDataValue = {
        lastUpdated: getEventDate(),
        created: getEventDate(),
        dataElement: 'MfykP4DsjUW',
        value: hfrCode,
        providedElsewhere: false
      };

      let facilityObject = {
        lastUpdated: getEventDate(),
        created: getEventDate(),
        dataElement: 'SMzP1R6D1dV',
        value: facilityTypeName(),
        providedElsewhere: false
      };

      let eventUid = await getEventUidByCode(referralId.toString());

      console.log("event uid :: ", eventUid)

      // let currentEventData = await getEventData('KlmXMXitsla', referralId.toString(), currentMenu.program);

      let currentEventData;

      if(eventUid['listGrid']['rows'] && eventUid['listGrid']['rows'][0] && eventUid['listGrid']['rows'][0][0]){
        currentEventData = await getEventByUid(eventUid['listGrid']['rows'][0][0]);

      }else{
        
      }
      
      console.log(currentEventData);
      console.log('current event data', currentEventData);

      let eventUpdatedData = {};
      eventUpdatedData['program'] = currentEventData.program;
      eventUpdatedData['programStage'] = currentEventData.programStage;
      eventUpdatedData['orgUnit'] = currentEventData.orgUnit;
      eventUpdatedData['status'] = currentEventData.status;
      eventUpdatedData['eventDate'] = currentEventData.eventDate;
      eventUpdatedData['event'] = currentEventData.event;
      eventUpdatedData['dataValues'] = currentEventData.dataValues;
      eventUpdatedData['completedDate'] = getEventDate();
      eventUpdatedData.dataValues = [...eventUpdatedData.dataValues, hfrDataValue, facilityObject];
      //console.log('eventsUpdatedData', eventUpdatedData.dataValues);
      //console.log('hfrCode', hfrCode);

      let number = _.find(eventUpdatedData.dataValues, dt => {
        return dt.dataElement == 'lDcAemv4pVO';
      })
        ? _.find(eventUpdatedData.dataValues, dt => {
            return dt.dataElement == 'lDcAemv4pVO';
          }).value
        : '';

      //console.log('number :: ', number);

      const response = await updateEventData(eventUpdatedData, eventUpdatedData.event);

      //console.log('updated values', eventUpdatedData.dataValues);
      //console.log('response', response);

      if (response && response.httpStatusCode == 200 && response.httpStatus == 'OK' && number != '') {
        sendSMS(
          [number],
          `Mteja wako mwenye kumb. Na. ${referralId} ya rufaa, amepokelewa kwenye kituo ${facility['organisationUnits'][0]['displayName']} chenye Namba ya msimbo ${hfrCode}. Asante kwa kufuata utaratibu uliowekwa kwa  kutoa rufaa inapotakiwa.`
        );
      }

      //original message: `Mteja wako mwenye kumb. Na. ${referralId} ya rufaa, amepokelewa kwenye (Aina ya kituo) ya/cha (Jina la kituo) Namba ya msimbo ${hfrCode}. Asante kwa kufuata utaratibu uliowekwa kwa  kutoa rufaa inapotakiwa.`

      return response;
    }
  } else {
    //added dataelement 'zaujKG9gZFs' for storing phonenumber for future sms when confirming referall, should be handled different in feature-sync branch

    const response = await postEventData({
      program,
      programStage,
      eventDate: getEventDate(),
      orgUnit,
      status: 'COMPLETED',
      dataValues: [...dtArray, { dataElement: 'lDcAemv4pVO', value: msisdn }]
    });

    return response;
  }
};
