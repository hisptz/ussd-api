const r2 = require('r2');
import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

const uploadData = (data) => {
  return async (server) => {
    await r2.post(`${server.url}/api/events`, {
      headers: {
        Authorization: getAuthorizationString(server.username, server.password)
      },
      json: data
    }).json;
  }
}
export const postEventData = data => {

  if(appConfig.otherServerss){

    const baseUrl = appConfig.otherServers[0].url
  const url = `${baseUrl}/api/events`;
  const Authorization = getAuthorizationString(appConfig.otherServers[0].username, appConfig.otherServers[0].password);

  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;

  }else{

    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/events`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  
    return r2.post(url, {
      headers: {
        Authorization
      },
      json: data
    }).json;

  }
  
};