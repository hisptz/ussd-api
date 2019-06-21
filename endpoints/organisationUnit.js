const r2 = require('r2');
import {
    appConfig,
    getAuthorizationString
} from '../config/app.config';

export const getOrganisationUnit = id => {
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/organisationUnits/${id}.json?fields=id,name,parent[id,name]`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

    return r2.get(url, {
        headers: {
            Authorization
        }
    }).json;
};