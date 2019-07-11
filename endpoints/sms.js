const r2 = require('r2');
const crypto = require('crypto');
//const CryptoJS = require("crypto-js");
import {
    appConfig,
    getAuthorizationString
} from '../config/app.config';

export const sendSMS = (phoneNumbers, message) => {
    const baseUrl = appConfig.url
    const url = `${baseUrl}/api/sms/outbound`;
    const Authorization = getAuthorizationString(appConfig.username, appConfig.password);
    /*return r2.post(url, {
        headers: {
            Authorization
        },
        json: {
            "message": message,
            "recipients": phoneNumbers
        }
    }).json;*/
    return sendEGASMS(phoneNumbers, message);
};

export const sendEGASMS = (phoneNumbers, message) => {
    console.log('Sending sms');
    const url = `http://msdg.ega.go.tz/msdg/public/quick_sms`;
    let datetime = getDate();
    let data = {"recipients": phoneNumbers.join(','), "message": message, "datetime": datetime, "mobile_service_id": 106, "sender_id": "15200"};
    let sendData = JSON.stringify(data);
    let hash = crypto.createHmac('sha256', appConfig.smsAPIKey)
        .update(sendData)
        .digest();
    return r2.post(url, {
        headers: {
            'X-Auth-Request-Hash': Buffer.from(hash).toString('base64'),
            'X-Auth-Request-Id': 'rsilumbe@gmail.com',
            'X-Auth-Request-Type': 'api'
        },
        json: {
            data: sendData,
            datetime
        }
    }).json;
};

const getDate =() => {
    let date = new Date();
    let day = date.getDate();
    if(day < 10){
        day = '0' + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }
    return date.getFullYear() + '-' + month  + '-'+ day+ ' '  + (date.toString()).substr(16, 8);
}