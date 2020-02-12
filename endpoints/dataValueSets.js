const r2 = require('r2');
import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

export const postAggregateData = data => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/dataValueSets`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  if (appConfig.otherServers) {
    appConfig.otherServers.forEach(async (server) => {
      await r2.post(`${server.url}/api/dataValueSets`, {
        headers: {
          Authorization: getAuthorizationString(server.username, server.password)
        },
        json: data
      }).json;
    })
  }
  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};

export const getAggregateData = (dataSet,period,orgUnit) => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/dataValueSets?dataSet=${dataSet}&orgUnit=${orgUnit}&period=${period}`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};