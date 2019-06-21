import {
  getSessionDataValue,
  updateSessionDataValues,
  addSessionDatavalues,
  getCurrentSession,
  getUser
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

export const submitData = async (sessionid, _currentMenu, USSDRequest, menus) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const {
    datatype,
    program,
    programStage
  } = sessionDatavalues;
  if (datatype === 'aggregate') {
    return sendAggregateData(sessionid);
  } else if (datatype === 'event') {
    return sendEventData(sessionid, program, programStage);
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
    dataSet.dataSetElements.forEach((dataSetElement) => {
      let found = false;
      if (dataValueSet.dataValues) {
        dataValueSet.dataValues.forEach((dataValue) => {
          if (dataValue.dataElement === dataSetElement.dataElement.id && dataValue.categoryCombo === dataSetElement.categoryCombo.id) {
            found = true;
          }
        })
      }
      if (!found){
        returnValue.notSet.push(dataSetElement.dataElement.shortName + " " + dataSetElement.categoryCombo.name)
      }
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
  const response = await postAggregateData({
    dataValues: dtArray
  });
  return response;
};

const sendEventData = async (sessionid, program, programStage) => {
  const sessionDatavalues = await getSessionDataValue(sessionid);
  const sessions = await getCurrentSession(sessionid);
  const {
    dataValues
  } = sessionDatavalues;
  const {
    orgUnit
  } = sessions;
  const dtValues = JSON.parse(dataValues);
  const dtArray = dtValues.map(({
    dataElement,
    value
  }) => ({
    dataElement,
    value
  }));

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; //January is 0!
  const year = today.getFullYear();

  const response = await postEventData({
    program,
    programStage,
    eventDate: `${year}-${month}-${day}`,
    orgUnit,
    status: 'COMPLETED',
    dataValues: dtArray
  });
  return response;
};