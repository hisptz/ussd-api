const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const postTrackerData = (data, server) => {
  const baseUrl = server.url;
  const url = `${baseUrl}/api/trackedEntityInstances`;
  const Authorization = getAuthorizationString(server.username, server.password);

  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};
