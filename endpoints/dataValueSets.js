const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const postAggregateData = (data) => {
  if (appConfig.otherServers) {
    const baseUrl = appConfig.otherServers[0].url;
    const url = `${baseUrl}/api/dataValueSets`;
    const Authorization = getAuthorizationString(appConfig.otherServers[0].username, appConfig.otherServers[0].password);

    return r2.post(url, {
      headers: {
        Authorization,
      },
      json: data,
    }).json;
  } else {

    const baseUrl = appConfig.url;
    const url = `${baseUrl}/api/dataValueSets`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

    return r2.post(url, {
      headers: {
        Authorization,
      },
      json: data,
    }).json;
  }

  // if (appConfig.otherServers) {
  //   appConfig.otherServers.forEach(async (server) => {
  //     await r2.post(`${server.url}/api/dataValueSets`, {
  //       headers: {
  //         Authorization: getAuthorizationString(server.username, server.password)
  //       },
  //       json: data
  //     }).json;
  //   })
  // }
};

export const getAggregateData = (dataSet, period, orgUnit) => {

  if(appConfig.otherServers){
    const baseUrl = appConfig.otherServers[0].url;
    const url = `${baseUrl}/api/dataValueSets?dataSet=${dataSet}&orgUnit=${orgUnit}&period=${period}`;
    const Authorization = getAuthorizationString(appConfig.otherServers[0].username, appConfig.otherServers[0].password);
  
    return r2.get(url, {
      headers: {
        Authorization,
      },
    }).json;
  }else{
    const baseUrl = appConfig.url;
    const url = `${baseUrl}/api/dataValueSets?dataSet=${dataSet}&orgUnit=${orgUnit}&period=${period}`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  
    return r2.get(url, {
      headers: {
        Authorization,
      },
    }).json;
  }

};
