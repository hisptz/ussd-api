const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const getDataSet = id => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/dataSets/${id}.json?fields=dataSetElements[dataElement[id,shortName,name],categoryCombo[categoryOptionCombos[id,shortName]]]`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};

var operands = {};
export const getDataSetOperands = async id => {
  if (!operands[id]) {
    const baseUrl = appConfig.url;
    let url = `${baseUrl}/api/dataSets/${id}.json?fields=dataSetElements[dataElement[id,shortName,name]]`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

    const results = await r2.get(url, {
      headers: {
        Authorization
      }
    }).json;
    const dataElements = results.dataSetElements.map(dataSetElement => {
      return dataSetElement.dataElement.id;
    });
    url = `${baseUrl}/api/dataElementOperands.json?filter=dataElement.id:in:[${dataElements.join(',')}]&fields=id,shortName,name`;
    console.log(url);
    operands[id] = r2.get(url, {
      headers: {
        Authorization
      }
    }).json;
  }

  return operands[id];
};

export const complete = (dataSet, period, orgUnit) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/completeDataSetRegistrations`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  if (appConfig.otherServers) {
    appConfig.otherServers.forEach(async server => {
      try {
        let results = await r2.post(`${server.url}/api/completeDataSetRegistrations`, {
          headers: {
            Authorization: getAuthorizationString(server.username, server.password)
          },
          json: {
            completeDataSetRegistrations: [
              {
                dataSet: dataSet,
                period: period,
                organisationUnit: orgUnit
              }
            ]
          }
        }).json;
      } catch (e) {
        console.log(e.stack);
      }
    });
  }
  return r2.post(url, {
    headers: {
      Authorization
    },
    json: {
      completeDataSetRegistrations: [
        {
          dataSet: dataSet,
          period: period,
          organisationUnit: orgUnit
        }
      ]
    }
  }).json;
};
