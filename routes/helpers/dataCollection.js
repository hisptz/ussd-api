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
  getDataSet
} from '../../endpoints/dataSet';
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
    const oldDataValues = JSON.parse(sessionDatavalues.dataValues);
    const dataValues = [...oldDataValues, ...dataValue];
    return updateSessionDataValues(sessionid, {
      ...data,
      dataValues: JSON.stringify(dataValues)
    });
  }

  return addSessionDatavalues({
    ...data,
    dataValues: JSON.stringify(dataValue)
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
    return sendAggregateData(sessionid);
  }
};

export const validatedData = async (sessionid, _currentMenu, USSDRequest, menus) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  
  const session = await getCurrentSession(sessionid);
  const menu = JSON.parse(session.datastore).menus[session.currentmenu];
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
  const {
    dataValues,
    datatype
  } = sessionDatavalues;
  return {
    dataValues: JSON.parse(dataValues),
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
  const dtValues = JSON.parse(dataValues);
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
  console.log('Aggergate:', dtArray);
  const response = await postAggregateData({
    dataValues: dtArray
  });
  console.log('response:',response)
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
  const datastore = JSON.parse(sessions.datastore);
  const {
    phone_number_mapping,
    auto_generated_field
  } = datastore.settings;
  const dtValues = JSON.parse(dataValues);
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