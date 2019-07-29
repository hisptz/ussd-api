const r2 = require('r2');
import {
    appConfig,
    getAuthorizationString
} from '../config/app.config';

export const sendSMS = (phoneNumbers, message) => {
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/sms/outbound`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
    phoneNumbers = ['255718026490'];
    return r2.post(url, {
        headers: {
            Authorization
        },
        json: {
            "message": message,
            "recipients": phoneNumbers
        }
    }).json;
};