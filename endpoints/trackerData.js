const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const postTrackerData = (data, server) => {
  const baseUrl = server.url;
  const url = `${baseUrl}/api/trackedEntityInstances`;

  console.log('post to this:: ', url);
  console.log('data to post :: ', data);
  console.log('events to post :: ', data.enrollments[0].events);
  console.log('events dataArr to post :: ', data.enrollments[0].events[0].dataValues);
  console.log('events data example to post :: ', data.enrollments[0].events[0].dataValues[0]);

  const Authorization = getAuthorizationString(server.username, server.password);

  return r2.post(url, {
    headers: {
      Authorization
    },
    json: data
  }).json;
};
