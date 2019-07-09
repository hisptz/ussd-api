import fetch from 'node-fetch';
import {
  appConfig,
  getAuthorizationString
} from '../config/app.config';

export const getUserFromDHIS2 = async phoneNumber => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/users.json?phoneNumber=${phoneNumber}&paging=false&fields=id,displayName,organisationUnits`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  const response = await fetch(url, {
    headers: {
      Authorization
    }
  });

  const data = await response.json();
  return data;
};
export const getUserGroup = async id => {
  const baseUrl = appConfig.url
  const url = `${baseUrl}/api/userGroups/${id}.json?fields=users[phoneNumber]`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  const response = await fetch(url, {
    headers: {
      Authorization
    }
  });

  const data = await response.json();
  return data;
};