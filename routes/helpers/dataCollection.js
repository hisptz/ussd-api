import {
  getSessionDataValue,
  updateSessionDataValues,
  addSessionDatavalues,
  getCurrentSession
} from '../../db';
import {
  postAggregateData, getAggregateData
} from '../../endpoints/dataValueSets';
import {
  postEventData
} from '../../endpoints/eventData';
import {
  getDataSet, complete, getDataSetOperands
} from '../../endpoints/dataSet';
import {
  sendSMS
} from '../../endpoints/sms';
import {
  getOrganisationUnit
}
  from '../../endpoints/organisationUnit';

import {
  getUserGroup
}
  from '../../endpoints/users';
import {
  getEventDate,
  getCurrentWeekNumber,
  getRandomCharacters
} from './periods';

export const collectData = async (sessionid, _currentMenu, USSDRequest) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const {
    dataType,
    category_combo,
    data_element,
    program,
    program_stage
  } = _currentMenu;
  const dataValue = [{
    dataElement: data_element,
    categoryOptionCombo: category_combo,
    value: USSDRequest
  }];
  const data = {
    sessionid,
    programStage: program_stage,
    program,
    datatype: dataType
  };
  if (sessionDatavalues) {
    let oldDataValues = sessionDatavalues.dataValues;
    try{
      oldDataValues = JSON.parse(oldDataValues);
    }catch(e){

    }
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
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const {
    datatype,
    program,
    programStage
  } = sessionDatavalues;
  if (datatype === 'aggregate') {
    return sendAggregateData(sessionid);
  } else if (datatype === 'event') {
    return sendEventData(sessionid, program, programStage, msisdn);
  } else {
    return completeForm(sessionid, msisdn);
  }
};

export const validatedData = async (sessionid, _currentMenu, USSDRequest, menus) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  
  const session = await getCurrentSession(sessionid);
  let menu = session.datastore;
  try {
    menu = JSON.parse(session.datastore);
  } catch (e) {

  }
  menu = menu.menus[session.currentmenu];
  const returnValue = {
    notSet: []
  };
  if(menu.dataSet){
    console.log(menu.dataSet);
    const dataSet = await getDataSet(menu.dataSet);

    const operands = await getDataSetOperands(menu.dataSet);

    const dataValueSet = await getAggregateData(menu.dataSet, sessionDatavalues.year +sessionDatavalues.period, session.orgUnit);
    operands.dataElementOperands.forEach((dataElementOperand) => {
      let found = false;
      if (dataValueSet.dataValues) {
        dataValueSet.dataValues.forEach((dataValue) => {
          if (dataValue.dataElement + '.' + dataValue.categoryOptionCombo === dataElementOperand.id) {
            found = true;
          }
        })
      }
      if (!found && menu.compulsory && menu.compulsory.indexOf(dataElementOperand.id) > -1) {
        returnValue.notSet.push(dataElementOperand.shortName);
      }
    })
    /*const ids = [];
    dataSet.dataSetElements.forEach((dataSetElement) => {
      console.log(JSON.stringify(dataSetElement));
      dataSetElement.categoryCombo.categoryOptionCombos.forEach((categoryOptionCombo)=> {
        let found = false;
        if (dataValueSet.dataValues) {
          dataValueSet.dataValues.forEach((dataValue) => {
            if (dataValue.dataElement === dataSetElement.dataElement.id && dataValue.categoryOptionCombo === categoryOptionCombo.id) {
              found = true;
            }
          })
        }
        if (!found && menu.compulsory && menu.compulsory.indexOf(dataSetElement.dataElement.id + "." + categoryOptionCombo.id) > -1) {
          returnValue.notSet.push(dataSetElement.dataElement.shortName + " " + categoryOptionCombo.shortName);
          ids.push(dataSetElement.dataElement.id + "." + categoryOptionCombo.id);
        }
      })
    })*/
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

export const getCurrentSessionDataValue = async sessionid => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  let {
    dataValues,
    datatype
  } = sessionDatavalues;
  try {
    dataValues = JSON.parse(dataValues);
  } catch (e) {

  }
  return {
    dataValues: dataValues,
    datatype
  };
}

const sendAggregateData = async sessionid => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const {
    dataValues,
    year,
    period
  } = sessionDatavalues;
  const {
    orgUnit
  } = sessions;
  const finalPeriod = `${year}${period}`;
  let dtValues = dataValues;
  try {
    dtValues = JSON.parse(dataValues);
  } catch (e) {

  }
  const dtArray = dtValues.map(({
    categoryOptionCombo,
    dataElement,
    value
  }) => ({
    categoryOptionCombo,
    dataElement,
    value,
    period: finalPeriod,
    orgUnit
  }));
  console.log(JSON.stringify(dtArray));
  const response = await postAggregateData({
    dataValues: dtArray
  });
  return response;
};

export const ruleNotPassed = async (sessionid, menu, answer) => {
  if (menu.rules){
    const sessionDatavalues = await getSessionDataValue(sessionid);
    const {
      dataValues
    } = sessionDatavalues;
    let dtValues = dataValues;
    try {
      dtValues = JSON.parse(dataValues);
    } catch (e) {

    }
    let retValue = false;
    menu.rules.forEach((rule) => {
      let ruleEval = rule.condition;
      dtValues.forEach((dtValue) => {
        ruleEval = ruleEval.split('#{' + dtValue.dataElement + '}').join(dtValue.value);
      })
      ruleEval = ruleEval.split('#{' + menu.data_element + '}').join(answer);
      try{
        if (eval('(' + ruleEval + ')')){
          retValue = rule.action;
        }
      }catch(e){

      }
    })
    return retValue;
  }else {
    return false;
  }
};
const completeForm = async (sessionid, phoneNumber) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const session = await getCurrentSession(sessionid);
  const {
    dataValues,
    year,
    period
  } = sessionDatavalues;
  const {
    orgUnit
  } = session;
  let menu = session.datastore;
  try {
    menu = JSON.parse(session.datastore);
  } catch (e) {

  }
  menu = menu.menus[session.currentmenu];
  const response = await complete(menu.dataSet,year + '' + period, orgUnit);
  const phoneNumbers = [phoneNumber];
  //phoneNumbers.push();
  const orgUnitDetails = await getOrganisationUnit(orgUnit);
  const message = 'Your Epidemiologic Week Number ' + period+ ' of ' + year+ 
  ' IDSR Report has been successfully submitted with ID number ' +
    + year + '' + period.substr(1) + '-' + (new Date()).toISOString().substr(14).split('.').join('').split(':').join('').split('Z').join('')
  + ', District: ' + orgUnitDetails.parent.name + ', Facility Name: ' + orgUnitDetails.name + '. Thank you';
  const result = await sendSMS(phoneNumbers, message);
  return response;
};

const sendEventData = async (sessionid, program, programStage, msisdn) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const {
    dataValues
  } = sessionDatavalues;
  const {
    orgUnit
  } = sessions;
  let datastore = sessions.datastore;
  try {
    datastore = JSON.parse(session.datastore);
  } catch (e) {

  }
  const {
    phone_number_mapping,
    auto_generated_field
  } = datastore.settings;
  let dtValues = dataValues;
  try {
    dtValues = JSON.parse(dataValues);
  } catch (e) {

  }
  let dtArray = dtValues.map(({
    dataElement,
    value
  }) => ({
    dataElement,
    value
  }));
  // adding phone number if exist on mapping
  if (phone_number_mapping && phone_number_mapping[program]) {
    const mappings = phone_number_mapping[program];
    mappings.map(mapping => {
      const {
        program_stage,
        data_element
      } = mapping;
      if (program_stage && programStage === program_stage && data_element) {
        dtArray.push({
          dataElement: data_element,
          value: msisdn
        })
      }
    })
  }
  // adding  auto generated fields if exist on mapping
  if (auto_generated_field && auto_generated_field[program]) {
    const mappings = auto_generated_field[program];
    mappings.map(mapping => {
      const {
        program_stage,
        data_element
      } = mapping;
      const value = `${getCurrentWeekNumber()}-${getRandomCharacters(12)}`;
      if (program_stage && programStage === program_stage && data_element) {
        dtArray.push({
          dataElement: data_element,
          value
        })
      }
    })
  }

  console.log(JSON.stringify(sessions.datastore.menus[sessions.currentmenu]));

  const event = {
    program,
    programStage,
    eventDate: getEventDate(),
    orgUnit,
    status: 'COMPLETED',
    dataValues: dtArray
  };

  const response = await postEventData(event);
  const menu = sessions.datastore.menus[sessions.currentmenu];
  if (menu.programNotificationTemplates) {
    menu.programNotificationTemplates.forEach(async (programNotificationTemplate) =>{
      let recipients = [];
      let message = programNotificationTemplate.messageTemplate; 
      
      event.dataValues.forEach((dataValue) => {
        if (programNotificationTemplate.notificationRecipient === 'DATA_ELEMENT' && dataValue.dataElement === programNotificationTemplate.recipientDataElement.id) {
          recipients.push(dataValue.value);
        }
        message = message.split('#{' + dataValue.dataElement + '}').join(dataValue.value);
      })
      const orgUnitDetails = await getOrganisationUnit(orgUnit);
      message = message.split('V{org_unit_name}').join(orgUnitDetails.name);
      message = message.split('V{org_unit_parent_name}').join(orgUnitDetails.parent.name);
      if (programNotificationTemplate.notificationRecipient === 'USER_GROUP') {
        const userGroup = await getUserGroup(programNotificationTemplate.recipientUserGroup.id);
        userGroup.users.forEach(async (user) =>{
          const result = await sendSMS([user.phoneNumber], message);
        })
      } else {
        const result = await sendSMS(recipients, message);
      }
    });
  }
  return response;
};