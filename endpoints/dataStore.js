import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

const fetch = require('make-fetch-happen').defaults({
  cacheManager: '../' // path where cache will be written (and read)
});
let data;
export const getDataStoreFromDHIS2 = async () => {
  if(!data){
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/dataStore/ussd/` + appConfig.dataStoreId;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password)

    const response = await fetch(url, {
      headers: {
        Authorization
      },
      size: 0,
      timeout: 0
    });
    // parsing
    data = await response.json();
  }
  return data;
};