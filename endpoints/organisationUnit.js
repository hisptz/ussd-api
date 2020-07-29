const r2 = require('r2');
import { appConfig, getAuthorizationString } from '../config/app.config';

export const getOrganisationUnit = id => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/organisationUnits/${id}.json?fields=id,code,name,parent[id,name]`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

  return r2.get(url, {
    headers: {
      Authorization
    }
  }).json;
};
export const getOrganisationUnitByCode = code => {
  const baseUrl = appConfig.url;
  const url = `${baseUrl}/api/organisationUnits.json?fields=id,name,displayName,organisationUnitGroups[name,groupSets[id]]&filter=code:eq:${code}`;
  const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
  const results = r2.get(url, {
    headers: {
      Authorization
    }
  });

  // console.log('results:', results);
  return results.json;
};
