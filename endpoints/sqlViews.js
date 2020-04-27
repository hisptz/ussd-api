const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const getCode = async id => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/sqlViews/zgTQnNbLVph/data.json?var=code:` + id;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};
