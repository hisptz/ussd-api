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
  getDataSet, complete
} from '../../endpoints/dataSet';
import {
  sendSMS
} from '../../endpoints/sms';
import {
  getOrganisationUnit
}
  from '../../endpoints/organisationUnit';
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
    const dataSet = await getDataSet(menu.dataSet);
    const dataValueSet = await getAggregateData(menu.dataSet, sessionDatavalues.year +sessionDatavalues.period, session.orgUnit);
    const ids = [];
    dataSet.dataSetElements.forEach((dataSetElement) => {
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
    })
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
  const response = await postAggregateData({
    dataValues: dtArray
  });
  return response;
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

  const response = await postEventData({
    program,
    programStage,
    eventDate: getEventDate(),
    orgUnit,
    status: 'COMPLETED',
    dataValues: dtArray
  });
  return response;
};