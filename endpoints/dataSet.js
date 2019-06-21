const r2 = require('r2');
import {
    appConfig,
    getAuthorizationString
} from '../config/app.config';

export const getDataSet = id => {
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/dataSets/${id}.json?fields=dataSetElements[dataElement[id,shortName], categoryCombo[id,name]]`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);

    return r2.get(url, {
        headers: {
            Authorization
        }
    }).json;
};