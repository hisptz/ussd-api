const r2 = require('r2');
const crypto = require('crypto');
import {
    appConfig,
    getAuthorizationString
} from '../config/app.config';

export const sendSMS = (phoneNumbers, message) => {
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/sms/outbound`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
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

export const sendEGASMS = () => {
    console.log('Sending sms');
    const url = `http://msdg.ega.go.tz/msdg/public/quick_sms`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
    let datetime = (new Date()).toISOString().split('T').join(' ').substr(0, 19);
    let data = {"recipients": "255718026490", "message": "Testing", "datetime": "2019-07-11 06:58:56", "mobile_service_id": 106, "sender_id": 15200};
    console.log('JSON.stringify(data)', JSON.stringify(data));
    const hash = crypto.createHmac('sha256', appConfig.smsAPIKey)
        .update(JSON.stringify(data))
        .digest();
    console.log('hash:', hash.toString('base64'));
    return r2.post(url, {
        headers: {
            Authorization,
            'X-Auth-Request-Hash': hash.toString('base64'),
            'X-Auth-Request-Id': 'rsilumbe@gmail.com',
            'X-Auth-Request-Type': 'api'
        },
        json: data
    }).response;
};