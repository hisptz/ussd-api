const r2 = require('r2');
import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

export const postEventData = data => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/events`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  //console.log('Data:', JSON.stringify(data));
  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};