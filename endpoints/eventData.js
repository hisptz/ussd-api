const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const postEventData = (data, server) => {
  const baseUrl = server.url;
  const url = `${baseUrl}/api/events`;
  const Authorization = getAuthorizationString(server.username, server.password);

  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};

export const getEventData = (dataElement, data, program) => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/events.json?program=${program}&filter=${dataElement}:eq:${data}`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};

export const updateEventData = (data, id, server) => {
  const baseUrl = server.url;
  const url = `${baseUrl}/api/events/${id}`;
  const Authorization = getAuthorizationString(server.username, server.password);
  return r2.put(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};
