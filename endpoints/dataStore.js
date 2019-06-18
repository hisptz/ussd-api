import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

const fetch = require('make-fetch-happen').defaults({
  cacheManager: '../' // path where cache will be written (and read)
});
export const getDataStoreFromDHIS2 = async () => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/dataStore/ussd/idsr`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password)

  const response = await fetch(url, {
    headers: {
      Authorization
    },
    size: 0,
    timeout: 0
  });
  // parsing
  const data = await response.json();
  return data;
};