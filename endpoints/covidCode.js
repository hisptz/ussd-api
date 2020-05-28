const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const generateCovidCode = () => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/trackedEntityAttributes/DBBpxkM88w5/generate.json`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};
